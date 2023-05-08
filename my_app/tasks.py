from my_app.models import Thread,User,Card, db
from my_app import celery
from flask_sse import sse
from datetime import datetime
import time
import pandas as pd
from flask_login import current_user

@celery.task(name='all_threads_csv')
def all_threads_csv():
    threads = Thread.query.filter_by(owner=current_user.id).all()
    list_of_threads=[]
    for thread in threads:
        list_of_threads.append([thread.id,thread.name,thread.description])

    pd.DataFrame(list_of_threads,columns=['id','name','description']).to_csv('/Users/ninad/Documents/kanban/my_app/static/threads.csv')

@celery.task(name='all_cards_csv')
def all_cards_csv(thread_id):
    cards = Card.query.filter_by(thread_id=thread_id).all()
    list_of_cards=[]
    for card in cards:
        list_of_cards.append([card.id,card.label,card.data,card.deadline,card.status,card.timestamp])

    pd.DataFrame(list_of_cards,columns=['id','label','data','deadline','status','timestamp']).to_csv('/Users/ninad/Documents/kanban/my_app/static/cards_{}.csv'.format(thread_id))

@celery.task(name='all_csv')
def all_csv():
    threads = Thread.query.filter_by(owner=current_user.id).all()
    list_of_cards=[]
    for thread in threads:
        cards = Card.query.filter_by(thread_id=thread.id).all()
        for card in cards:
            list_of_cards.append([card.id,card.label,card.data,card.deadline,card.timestamp,card.status,thread.id])

    pd.DataFrame(list_of_cards,columns=['id','label','data','deadline','timestamp','status','thread_id']).to_csv('/Users/ninad/Documents/kanban/my_app/static/all_csv.csv')

@celery.task(name='summary_data')
def summary_data():
    data=[]
    threads = Thread.query.filter_by(owner=current_user.id).all()
    thread_data={}
    thread_data['card_status']=[]
    thread_data['card_deadline']=[]
    # print(threads)
    for thread in threads:
      # print(thread.name)
      thread_data['name']=thread.name  #upward one if completed downward one if not completd and danger if not completed and deadline is passed
      thread_data['note']='A partion in the graph before today and after today sort based on deadline'
      
      cards = Card.query.filter_by(thread_id=thread.id).all()
      # print(cards)
      for card in cards:
        print(card.data)
        thread_data['card_status'].append(card.status)
        thread_data['card_deadline'].append(card.deadline.strftime("%d/%m/%Y"))
      data.append(thread_data)    #had to append from the back
      thread_data={}
      thread_data['card_status']=[]
      thread_data['card_deadline']=[]
    return data

@celery.task(name='summary_thread_data')
def summary_thread_data(thread_id):
    thread = Thread.query.filter_by(id=thread_id).first()
    thread_data={}
    thread_data['card_status']=[]
    thread_data['card_deadline']=[]
    thread_data['name']=thread.name  
    cards = Card.query.filter_by(thread_id=thread.id).all()
    thread_data['count']=len(cards)
    for card in cards:
        if card.status==True:
            thread_data['card_status'].append(1)
        else:
            thread_data['card_status'].append(-1)
        thread_data['card_deadline'].append(card.deadline.strftime("%d/%m/%Y"))
    print(thread_data)
    return thread_data


@celery.task(name='monthly.report')         #crontab
def monthly_new_thread():
    now= datetime.now()
    mon=now.strftime("%B")
    print(mon)
    new_thread=Thread(name=mon,owner=current_user.id,description='goals for the month of {}'.format(mon))
    db.session.add(new_thread)
    db.session.commit()
    return ''

