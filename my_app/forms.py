from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, DateTimeLocalField, widgets,IntegerField,DateTimeField
from wtforms.validators import Length, EqualTo, Email, DataRequired, ValidationError, InputRequired
from my_app.models import User


class RegisterForm(FlaskForm):
    def validate_username(self,username_to_check):
        user=User.query.filter_by(username=username_to_check.data).first()
        if user:
            raise ValidationError('Username already exists !!')
    
    def validate_email(self,email_to_check):
        e_mail=User.query.filter_by(email=email_to_check.data).first()
        if e_mail:
            raise ValidationError('Email already Exists!! Try Logging in !!')

    username=StringField(label='Username: ', validators=[Length(min=2,max=30),DataRequired()])
    email=StringField(label='Email: ', validators=[Email(),DataRequired()])
    password1= PasswordField(label='Password: ', validators=[Length(min=6),DataRequired()])
    password2= PasswordField(label='Confirm Password: ', validators=[EqualTo('password1'),DataRequired()])
    submit=SubmitField(label='Create Account')

class LoginForm(FlaskForm):
    username=StringField(label='User Name :', validators=[DataRequired()])
    password=PasswordField(label='Password', validators=[DataRequired()])
    submit=SubmitField(label='Sign In')

class UpdateThread(FlaskForm):
    name=StringField(label='Name: ', validators=[Length(min=2,max=30),DataRequired()])
    submit=SubmitField(label='Update')

class DeleteThread(FlaskForm):
    submit=SubmitField(label='Delete')

class AddThread(FlaskForm):
    name=StringField(label='Tracker Name: ', validators=[Length(min=2,max=30),DataRequired()])
    submit=SubmitField(label='Add Tracker')

class UpdateCard(FlaskForm):
    data=StringField(label='Data ', validators=[DataRequired()])
    deadline=DateTimeLocalField(label='Deadline : ',format='%Y-%m-%dT%H:%M')    #something is wrong here
    label=StringField(label='Label : ')
    submit=SubmitField(label='Update Log')

class DeleteCard(FlaskForm):
    submit=SubmitField(label='Delete Log')

class AddCard(FlaskForm):
    data=StringField(label='Data ', validators=[DataRequired()])
    deadline=DateTimeLocalField(label='Deadline : ',format='%Y-%m-%dT%H:%M')    #something is wrong here
    label=StringField(label='Label : ')
    submit=SubmitField(label='Add Log')