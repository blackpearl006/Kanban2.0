import os , time
from datetime import datetime
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_restful import Resource , Api
from flask_cors import CORS
from my_app.flask_celery import make_celery
from flask_sse import sse
from flask_jwt_extended import JWTManager
from flask_caching import Cache

current_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
api=None
celery = None
cache = None
api=Api(app)  
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///" + os.path.join(current_dir, "test.sqlite3") 
app.config['SECRET_KEY']='adb17a378fb857c96f99b63f26c7b1'
app.config['REDIS_URL']='redis://localhost:6379'
db = SQLAlchemy()
db.init_app(app)
bcrypt=Bcrypt(app)
CORS(app)
login_manager=LoginManager(app)
login_manager.login_view="login_page"
login_manager.login_message_category="info"
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
# app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER']="Authentication"
jwt = JWTManager(app)
app.config['CACHE_TYPE']="RedisCache"
app.config['CACHE_REDIS_HOST'] = "localhost"
app.config['CACHE_REDIS_PORT'] = 6379
app.app_context().push()


app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379',
    timezone='Asia/Kolkata'
)
celery = make_celery(app)
app.app_context().push()

cache = Cache(app)
app.app_context().push()





app.register_blueprint(sse, url_prefix='/stream')

from my_app import routes


# @app.after_request
# def refresh_expiring_jwts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original response
#         return response