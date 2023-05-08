from my_app import app, api, cache
from flask import render_template, url_for, redirect, flash, jsonify, request, current_app
from flask_sse import sse
from flask_cors import cross_origin
import logging
logging.basicConfig(filename='debug.log',level=logging.DEBUG,format=f'%(asctime)s %(name)s %(threadName)s : %(message)s')
from my_app.api import UserAPI,ThreadAPI,CardAPI,AllThreadAPI,AllCardAPI,CurrentUser, LoginUser, TransferCard, TaskComplete, AllThreadCSV,AllCardCSV,AllCSV, Summary, CardStatus,SummaryThread
api.add_resource(UserAPI, "/api/user/<string:username>", "/api/user")
api.add_resource(ThreadAPI, "/api/thread", "/api/thread/<string:name>")
api.add_resource(CardAPI, "/api/card/<int:card_id>", "/api/newcard/<int:thread_id>")
api.add_resource(AllThreadAPI, "/api/allthread")
api.add_resource(AllCardAPI, "/api/allcard/<int:thread_id>")
api.add_resource(CurrentUser,"/api/current_user")
api.add_resource(LoginUser,"/api/login")
api.add_resource(TransferCard,"/api/transfercard/<int:card_id>")
api.add_resource(TaskComplete,"/api/completed/<int:card_id>")
api.add_resource(AllThreadCSV,"/api/allthreadcsv")
api.add_resource(AllCardCSV,"/api/allcardcsv/<int:thread_id>")
api.add_resource(AllCSV,"/api/allcsv")
api.add_resource(Summary,"/api/summary")
api.add_resource(CardStatus,"/api/cardstatus/<int:thread_id>")
api.add_resource(SummaryThread,"/api/summarythread/<int:thread_id>")


@app.route('/', methods=['GET', 'POST'])
def SOMETHING():
    return render_template('base.html')


@app.route('/protected')
def SOMETHING_ELSE():
    # email_main()
    # all_threads_csv()
    # all_csv()
    # happy_new_year()
    # monthly_report()
    # monthly_new_thread()
    # summary_thread_data(12)
    # daily_remainder()
    return jsonify({'message':'only for logged in people'})
