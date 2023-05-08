from my_app.models import User, Thread, Card
from flask_login import current_user
from my_app import cache

# @cache.memoize(10)
def get_all_threads():
    threads = Thread.query.filter_by(owner=current_user.id).all()
    return threads

# @cache.memoize(10)
def get_all_cards(thread_id):
    card = Card.query.filter_by(thread_id=thread_id).all()
    return card


def delete_all_cards(thread_id):
    # cache.delete_memoized(get_all_cards,thread_id)
    return 

def delete_all_threads():
    # cache.delete_memoized(get_all_threads)
    return 