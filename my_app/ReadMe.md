# Read ME
* Start redis server inside the virtual env - redis-server 
* Start the flask app
* Start the flask celery with the command - celery -A my_app.celery worker -l info
* Start gunicorn with the command - gunicorn my_app:app --worker-class gevent --bind 127.0.0.1:8000 --workers=4
* Start mailhog
* Start celery-crontab command - celery -A my_app.celery beat --max-interval 1 -l info
* Enable the virtual evironment - source env/bin/activate
* Start the web app by - python main.py