import smtplib
from email import encoders
from flask import current_app as app
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from jinja2 import Template
from my_app.models import User, Thread, Card
from my_app import celery
from celery.schedules import crontab

@celery.on_after_finalize.connect
def setup_periodic_task(sender,**kwargs):
    sender.add_periodic_task(crontab(minute=0, hour=0),daily_remainder.s(),name='At 12:00am daily')

@celery.on_after_finalize.connect
def setup_periodic_task_monthly(sender,**kwargs):
    sender.add_periodic_task(crontab(0, 0, day_of_month='1'),monthly_report.s(),name='Every month')

SMPTP_SERVER_HOST="localhost"
SMPTP_SERVER_PORT=1025
SENDER_ADDRESS="email@ninad.com"
SENDER_PASSWORD=""

def send_email(to_address,subject,message,content="text",attachment_file=None):
    msg = MIMEMultipart()
    msg['From'] = SENDER_ADDRESS
    msg['To'] = to_address
    msg['Subject'] = subject

    if content=='html':
        msg.attach(MIMEText(message,'html'))
    else:
        msg.attach(MIMEText(message,"plain"))

    if attachment_file:
        with open(attachment_file,"rb") as attachment:
            part = MIMEBase("application","octet-stream")
            part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition", f"attachment; filename={attachment_file}",
        )
        msg.attach(part)

    try:
        s=smtplib.SMTP(host=SMPTP_SERVER_HOST,port=SMPTP_SERVER_PORT)
        s.login(SENDER_ADDRESS,SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()
        return True
    except:
        return 404

# open("/Users/ninad/Documents/kanban/my_app/templates/welcome.html") as file_:
def format_email(template_file,data={}):
    with open(template_file) as file_:
            template= Template(file_.read())
            return template.render(data=data)


@celery.task(name='welcome.mail')
def welcome_email(user):
    message=format_email('/Users/ninad/Documents/kanban/my_app/templates/welcome.html',data=user) 
    send_email(user.email,subject='Welcome Email',message=message,content="html",attachment_file='/Users/ninad/Documents/kanban/my_app/static/manual.pages')

@celery.task(name='monthly.report')
def monthly_report():
    all_user = User.query.all()
    for user in all_user:
        data=[]
        threads = Thread.query.filter_by(owner=user.id).all()
        thread_data={}
        user_data={}
        user_data['username']= user.username
        user_data['email']= user.email
        thread_data['card_status']=[]
        thread_data['card_deadline']=[]
        thread_data['card_data']=[]
        thread_data['card_label']=[]
        for thread in threads:
            thread_data['name']=thread.name  #upward one if completed downward one if not completd and danger if not completed and deadline is passed
            thread_data['description']=thread.description
            cards = Card.query.filter_by(thread_id=thread.id).all()
            for card in cards:
                print(card.data)
                thread_data['card_data'].append(card.data)
                thread_data['card_label'].append(card.label)
                thread_data['card_status'].append(card.status)
                thread_data['card_deadline'].append(card.deadline.strftime("%d/%m/%Y"))
            data.append(thread_data)    
            thread_data={}
            user_data={}
            thread_data['card_status']=[]
            thread_data['card_deadline']=[]
            thread_data['card_data']=[]
            thread_data['card_label']=[]
        print(data)    
        message=format_email('/Users/ninad/Documents/kanban/my_app/templates/monthly_report.html',data=data) 
        send_email(user.email,subject='Monthly Report',message=message,content="html",attachment_file='/Users/ninad/Documents/kanban/my_app/static/manual.pages')


@celery.task(name='daily.remainder')         #crontab
def daily_remainder():
    all_user = User.query.all()
    for user in all_user:
        data=[]
        threads = Thread.query.filter_by(owner=user.id).all()
        for thread in threads:
            cards = Card.query.filter_by(thread_id=thread.id).all()
            for card in cards:
                if card.status==False:
                    data.append({'name':thread.name,'data':card.data,'label':card.label,'deadline':card.deadline.strftime("%d/%m/%Y")}) #this card is remaining
        if (data!=[]):
            message=format_email('/Users/ninad/Documents/kanban/my_app/templates/daily_remainder.html',data=data) 
            send_email(user.email,subject='Daily Remainder',message=message,content="html")