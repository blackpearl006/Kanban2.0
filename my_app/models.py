from my_app import db, login_manager
from my_app import bcrypt
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model,UserMixin):
    id=db.Column(db.Integer(), primary_key=True)
    username=db.Column(db.String(length=40), nullable=False, unique=True)
    email=db.Column(db.String(length=50), nullable=False, unique=True)
    password_hash=db.Column(db.String(length=60), nullable=False)
    threads=db.relationship('Thread',backref='owned_user', lazy=True)   
    admin = db.Column(db.Boolean(),default=False)  
    # dob = timestamp=db.Column(db.DateTime())    
    fs_uniquifier = db.Column(db.String(), unique=True, nullable=False)

    @property
    def password(self):
        return self.password

    @password.setter
    def password (self,plain_text_password):
        self.password_hash=bcrypt.generate_password_hash(plain_text_password).decode('utf-8')
    
    def check_password_correction(self,attempted_password):
        return bcrypt.check_password_hash(self.password_hash,attempted_password)

class Thread(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String()) 
    owner=db.Column(db.Integer(), db.ForeignKey('user.id'))
    card=db.relationship('Card',cascade="all, delete")
    description = db.Column(db.String())
    #last_modified=db.Column(db.Integer())     


class Card(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    data=db.Column(db.String())
    label=db.Column(db.String())
    # created = db.Column(db.DateTime())
    deadline=db.Column(db.DateTime())
    timestamp=db.Column(db.DateTime())
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id',ondelete="CASCADE"))
    status = db.Column(db.Boolean(),default=False)
