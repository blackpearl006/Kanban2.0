# Kanban 2.0 Application

This is a Kanban app developed using Flask framework in Python. The app allows users to record day-to-day life activities as cards, which can be grouped into threads. Users can register and add threads and card values and are provided with a graphical representation of the tasks completed. Users can also manipulate threads and cards by updating or deleting them, or moving a card from one thread to another.

## Author

Ninad Aithal
21f1006030@student.onlinedegree.iitm.ac.in

## Technologies Used

- Flask: Framework used to create the web app using Python
- Flask-SQLAlchemy: Tools and methods to interact with database from Flask application
- Flask-Bcrypt: Enables hashing and related utilities
- Flask-Login: Access control and session management
- Flask-Restful: Construct APIs
- Flask-JWT-Extended: For token-based access
- Flask-Celery: To run processes that run the background jobs
- Flask-Caching: For caching
- Jinja2: For creating monthly reports
- Pandas: For converting the database into CSV for export

## DB Schema Design

- Three tables: User, Thread, Card
- Two one-to-many relationships: User.id < Thread.owner and thread.id < Card.thread_id
- If we delete a Thread, all the Cards associated with the Thread are deleted due to cascading operation

## API Design

API Classes:

- UserAPI: GET, POST, PUT, DELETE
- ThreadAPI: GET, POST, PUT, DELETE
- CardAPI: GET, POST, PUT, DELETE, PATCH
- AllThreadAPI: GET
- AllCardAPI: GET
- CurrentUser: GET
- LoginUser: GET, POST
- TransferCard: PUT
- TaskComplete: GET
- AllThreadCSV
- AllCardCSV
- AllCSV
- Summary
- SummaryThread
- CardStatus

Celery tasks:

- all_threads_csv
- all_cards_csv
- all_csv
- summary_data
- summary_thread_data
- monthly_new_thread
- welcome_email
- monthly_report
- daily_remainder

## Architecture and Features

The app is organized as follows:

- `my_app` folder and `main.py` are inside the zip folder.
- To run the web app, run the `main.py` file (refer `ReadMe.md`).
- `my_app` contains:
  - `ReadMe.md`
  - `Static` folder: Contains all the JavaScript, CSS, and images.
  - `Template` folder: Contains all the templates used for emails.
  - `test.sqlite3`: Database.
  - `__init__.py`: Initializes the app.
  - `data_access.py`: For caching.
  - `routes.py`: For Flask routes.
  - `api.py`: Contains all the APIs.
  - `tasks.py`: For implementing Celery tasks.

Default features like CRUD operations on threads and cards have been implemented, and a graphical representation of thread and card is being displayed on the summary page. For creating new threads and cards, a cue-router is being called, whereas for updating and deleting, modals are being used. For rendering of graphs, Chart.js is being used.

## Video

A demo video of the app is available at: [https://drive.google.com/file/d/18LKowjyTO8ml_a-bxaIcru-N2G3Ess3e/view?usp=sharing]
