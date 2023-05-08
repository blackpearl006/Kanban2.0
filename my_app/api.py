from flask import jsonify, send_file
from flask_restful import Resource, marshal_with,fields,reqparse
from flask_login import current_user, login_user, logout_user, login_required
from dateutil import parser
import re, uuid, datetime
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required
from time import perf_counter_ns
from my_app.validation import NotFoundError,BusinessValidationError,ThreadValidationError,CardValidationError, LoginError
from my_app.data_access import get_all_threads, get_all_cards, delete_all_cards, delete_all_threads
from my_app.tasks import all_threads_csv, all_cards_csv, all_csv, summary_data, summary_thread_data
from my_app.email import welcome_email
from my_app.models import db, User, Thread, Card

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

def check(email):
  if(not re.fullmatch(regex, email)):
    raise BusinessValidationError(status_code=410,error_code="BE1003",error_message="Invalid email")

login_user_output_fields={
  "id":fields.Integer,
  "username":fields.String,
  "email":fields.String,
  "access_token":fields.String,      
  "refresh_token":fields.String
}

user_output_fields={
  "id":fields.Integer,
  "username":fields.String,
  "email":fields.String,
  "fs_uniquifier":fields.String
}
new_user_parser=reqparse.RequestParser()
new_user_parser.add_argument('username')
new_user_parser.add_argument('email')
new_user_parser.add_argument('password')
new_user_parser.add_argument('confirm_pass')

update_user_parser=reqparse.RequestParser()
update_user_parser.add_argument('email')

class UserAPI(Resource):
  @marshal_with(user_output_fields)
  def get(self,username):
    user = User.query.filter_by(username=username).first()  #try-catch 
    if user:
      return user
    else:
      return NotFoundError(status_code=404)

  @marshal_with(user_output_fields)
  def delete(self,username):
    user = User.query.filter_by(username=username).first()  #try-catch 
    if user is None:
      return NotFoundError(status_code=404)
    threads=Thread.query.filter_by(owner=user.id).first()
    if threads :
      raise BusinessValidationError(status_code=400,error_code="BE1005",error_message="cant delete as there are trackers associated with user")
    db.session.delete(user)
    db.session.commit()
    return '',200
  
  @marshal_with(user_output_fields)
  def put(self,username):
    args=update_user_parser.parse_args()
    upd_email=args.get("email",None)
    if upd_email is None:
      raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="email is required")
    if "@" not in upd_email :
      raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="Invalid email")
    user_e=User.query.filter(User.email==upd_email).first()
    if user_e:
      raise BusinessValidationError(status_code=400,error_code="BE1006",error_message="Dulpicate email")
    user=User.query.filter_by(username=username).first()
    if user is None:
      raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="username is required")
    user.email=upd_email
    db.session.commit()
    return '',200
    
  @marshal_with(user_output_fields)  
  def post(self):
    args=new_user_parser.parse_args()
    username=args.get("username",None)
    email=args.get("email",None)
    password=args.get("password",None)
    confirm_pass=args.get("confirm_pass",None)
    fs_uniquifier=str(uuid.uuid1())
    if username is None:
      raise BusinessValidationError(status_code=400,error_code="BE1001",error_message="username is required")
    if email is None:
      raise BusinessValidationError(status_code=410,error_code="BE1002",error_message="email is required")
    if password is None:
      raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="password is required")
    if confirm_pass is None:
      raise BusinessValidationError(status_code=400,error_code="BE1002",error_message="confirm_pass is required")
    check(email)
    if "@" not in email :
      raise BusinessValidationError(status_code=400,error_code="BE1003",error_message="Invalid email")
    user=User.query.filter( (User.username==username) | (User.email==email)).first()
    if user:
      raise BusinessValidationError(status_code=400,error_code="BE1004",error_message="User already exists")
    user_e=User.query.filter(User.email==email).first()
    if user_e:
      raise BusinessValidationError(status_code=400,error_code="BE1006",error_message="Dulpicate email")
    if (password!=confirm_pass):
      raise BusinessValidationError(status_code=400,error_code="BE1006",error_message="Password's Dont match")
    
    new_user=User(username=username,email=email,password=password,fs_uniquifier=fs_uniquifier)
    db.session.add(new_user)
    db.session.commit()
    welcome_email(user=user)
    return new_user ,200

thread_output_fields={
    "id":fields.Integer,
    "name":fields.String,
    "description":fields.String,
}

new_thread_parser=reqparse.RequestParser()
new_thread_parser.add_argument('name')
new_thread_parser.add_argument('description')


upd_thread_parser=reqparse.RequestParser()
upd_thread_parser.add_argument('name')
upd_thread_parser.add_argument('description')

class ThreadAPI(Resource):

  @marshal_with(thread_output_fields)
  def get(self,name):
    thread = Thread.query.filter_by(name=name).first() 
    if thread:
      return thread
    else:
      return NotFoundError(status_code=404)

  @jwt_required()
  @marshal_with(thread_output_fields)  
  def post(self):
    delete_all_threads()
    args=new_thread_parser.parse_args()
    name=args.get("name",None)
    description=args.get("description",None)
    owner=current_user.id         
    if name is None:
      raise ThreadValidationError(status_code=400,error_code="T001",error_message="Thread name is required")
    if name == "":
      raise ThreadValidationError(status_code=400,error_code="T001",error_message="Thread name is required")

    thread=Thread.query.filter(Thread.name==name).first()
    if thread:
      raise ThreadValidationError(status_code=400,error_code="T005",error_message="Thread already exists")

    new_thread=Thread(name=name,owner=owner,description=description)
    db.session.add(new_thread)
    db.session.commit()
    return new_thread,201

  @marshal_with(thread_output_fields)
  def delete(self,name):
    
    thread=Thread.query.filter_by(name=name).first()
    delete_all_threads()
    if thread is None:
      return NotFoundError(status_code=404)
    db.session.delete(thread)
    db.session.commit()
    return '',200

  @marshal_with(thread_output_fields)  
  def put(self,name):
    args=upd_thread_parser.parse_args()
    upd_name=args.get("name",None)
    upd_description=args.get("description",None)
    delete_all_threads()
    if upd_name is None:
      raise ThreadValidationError(status_code=400,error_code="T002",error_message="Thread name is required")
    if upd_name == "":
      raise ThreadValidationError(status_code=400,error_code="T002",error_message="Thread name cannot be empty")
    thread=Thread.query.filter(Thread.name==upd_name).first()
    if thread:
      raise ThreadValidationError(status_code=400,error_code="T004",error_message="Thread already exists")
    thread=Thread.query.filter(Thread.name==name).first()
    thread.name = upd_name
    thread.description = upd_description
    db.session.commit()
    return '',200

card_output_fields={
  "id":fields.Integer,
  "data":fields.String,
  "label":fields.String,
  "deadline":fields.DateTime,
  "timestamp":fields.DateTime,
  "status":fields.Boolean,
}

new_card_parser=reqparse.RequestParser()
new_card_parser.add_argument('data')
new_card_parser.add_argument('label')
new_card_parser.add_argument('deadline')
new_card_parser.add_argument('thread_id')

upd_card_parser=reqparse.RequestParser()
upd_card_parser.add_argument('data')
upd_card_parser.add_argument('label')
upd_card_parser.add_argument('deadline')

card_complete_parser=reqparse.RequestParser()
card_complete_parser.add_argument('status')

class CardAPI(Resource):    
  @marshal_with(card_output_fields)
  def get(self,card_id):
    card = Card.query.filter_by(id=card_id).first()  #try-catch 
    if card :
        return card
    else:
        return NotFoundError(status_code=404)
      
  @marshal_with(card_output_fields)  
  def post(self,thread_id):
    args=new_card_parser.parse_args()
    data=args.get("data",None)
    label=args.get("label",None)
    deadline=args.get("deadline",None)

    now = datetime.datetime.now()
    # print(deadline)

    delete_all_cards(thread_id)
    try:
      # deadline_obj = datetime.datetime.strptime(deadline,'%y/%m/%dT%H:%M')
      deadline_obj=parser.parse(deadline)
      #print(deadline_obj.date)
    except :
      raise ThreadValidationError(status_code=400,error_code="L005",error_message="deadline format not as required! Use %d/%m/%y %H:%M:%S.%f")

    if data is None:
      raise ThreadValidationError(status_code=400,error_code="L001",error_message="data required")
    if label is None:
      raise ThreadValidationError(status_code=400,error_code="L002",error_message="label required")
    if deadline is None:
      raise ThreadValidationError(status_code=400,error_code="T002",error_message="deadline required")
    thread=Thread.query.filter_by(id=thread_id).first()
    if thread is None:
      raise ThreadValidationError(status_code=400,error_code="T002",error_message="thread doesnt exists")

    card=Card.query.filter((deadline==deadline_obj)&(label==label)&(data==data)).first()
    if card : raise CardValidationError(status_code=400,error_code="T002",error_message="card already exits")

    new_card=Card(data=data,deadline=deadline_obj,label=label,thread_id=thread.id,timestamp=now)
    db.session.add(new_card)
    db.session.commit()
    return new_card,201

  @marshal_with(card_output_fields)
  def delete(self,card_id):
    card = Card.query.filter_by(id=card_id).first()  #try-catch 
    if card is None:
        return NotFoundError(status_code=404)
    delete_all_cards(card.thread_id)
    db.session.delete(card)
    db.session.commit()
    return '',200

  @marshal_with(card_output_fields)  
  def put(self,card_id):
    
    args=upd_card_parser.parse_args()
    data=args.get("data",None)
    label=args.get("label",None)
    deadline=args.get("deadline",None)

    now = datetime.datetime.now()
    try:
      deadline_obj=parser.parse(deadline)
    except :
      raise ThreadValidationError(status_code=400,error_code="L005",error_message="deadline format not as required! Use %d/%m/%y %H:%M:%S.%f")

    if data is None:
      raise ThreadValidationError(status_code=400,error_code="L001",error_message="data required")
    if label is None:
      raise ThreadValidationError(status_code=400,error_code="L002",error_message="label required")
    if deadline is None:
      raise ThreadValidationError(status_code=400,error_code="T002",error_message="deadline required")
    card=Card.query.filter_by(id=card_id).first()
    if card is None:
      raise ThreadValidationError(status_code=400,error_code="T002",error_message="card doesnt exists")

    card.data=data
    card.label=label
    card.deadline=deadline_obj
    card.timestamp = now
    delete_all_cards(card.thread_id)
    db.session.commit()
    return '',200

  @marshal_with(card_output_fields) #get api would have been enough
  def patch(self,card_id):
    args=card_complete_parser.parse_args()
    satus=args.get("status",0)
    # print('card_id : ',card_id)
    now = datetime.datetime.now()

    card = Card.query.filter_by(id=card_id).first() 
    if card is None:
        return NotFoundError(status_code=404)

    card.status=True
    card.timestamp=now
    db.session.commit()
    return '',200

class AllThreadAPI(Resource):

  @marshal_with(thread_output_fields)
  def get(self):
    start = perf_counter_ns()
    thread = get_all_threads()  #try-catch 
    stop = perf_counter_ns()
    # print(stop-start)
    if thread:
      return thread
    else:
      return NotFoundError(status_code=404)

class AllCardAPI(Resource):
  @marshal_with(card_output_fields)
  def get(self,thread_id):

    start = perf_counter_ns()
    card = get_all_cards(thread_id)
    stop = perf_counter_ns()
    print(stop-start)
    if card:
      return card
    else:
      return NotFoundError(status_code=404)

class CurrentUser(Resource):
  @marshal_with(user_output_fields)
  def get(self):
    try: return current_user
    except : return NotFoundError(status_code=404)



login_parser=reqparse.RequestParser()
login_parser.add_argument('username')
login_parser.add_argument('password')

class LoginUser(Resource):
  @marshal_with(login_user_output_fields)
  def post(self):
    args=login_parser.parse_args()
    attempted_user = args.get('username')
    attempted_user_password = args.get('password')
    user = User.query.filter_by(username=attempted_user).first()
    if (user and user.check_password_correction(attempted_password=attempted_user_password)):
      access_token = create_access_token(identity = user.fs_uniquifier)
      refresh_token = create_refresh_token(identity = user.fs_uniquifier)
      # print(access_token)
      login_user(user)
      logged_in_user={'id': user.id,"username":user.username,"email":user.email,"access_token":access_token,"refresh_token":refresh_token}
      return logged_in_user ,200
    else :
      raise LoginError(status_code=400,error_code="L001",error_message="Login Unsucsseful")


  @marshal_with(login_user_output_fields)
  def get(self):
    logout_user()
    return jsonify({'message':'user logged out'}) ,200

upd_thread_id_parser=reqparse.RequestParser()
upd_thread_id_parser.add_argument('thread_id')

class TransferCard(Resource):
  @marshal_with(card_output_fields)
  def put(self,card_id):        #get would have worked over here
    args=upd_thread_id_parser.parse_args()
    thread_id=args.get("thread_id",0)
    print('card_id : ',card_id)
    now = datetime.datetime.now()

    card = Card.query.filter_by(id=card_id).first() 
    # print('I\'m here at transferCard put')
    # print(card)
    if card is None:
        return NotFoundError(status_code=404)

    card.thread_id=thread_id
    card.timestamp=now
    db.session.commit()
    return '',200

class TaskComplete(Resource):
  @marshal_with(card_output_fields)
  def get(self,card_id):
    card = Card.query.filter_by(id=card_id).first() 
    card.status=True
    db.session.commit()
    return '',200

class AllThreadCSV(Resource):
  def get(self):
    all_threads_csv()
    return send_file('/Users/ninad/Documents/kanban/my_app/static/threads.csv')

class AllCardCSV(Resource):
  def get(self,thread_id):
    all_cards_csv(thread_id)
    return send_file('/Users/ninad/Documents/kanban/my_app/static/cards_{}.csv'.format(thread_id))

class AllCSV(Resource):
  def get(self):
    all_csv()
    return send_file('/Users/ninad/Documents/kanban/my_app/static/all_csv.csv')

class Summary(Resource):
  def get(self):
    return summary_data()

class SummaryThread(Resource):
  def get(self,thread_id):
    return summary_thread_data(thread_id)

class CardStatus(Resource):
   def get(self,thread_id):
    cards = Card.query.filter_by(thread_id=thread_id).all()
    completed,pending=0,0
    for card in cards:
        # list_of_cards.append([card.id,card.label,card.data,card.deadline,card.status,card.timestamp])
        if card.status==1:
          completed=completed+1
        else: pending=pending+1
    return {'completed':completed,'pending':pending}