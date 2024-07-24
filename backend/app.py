from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from sqlalchemy.sql import func 
import logging
from flask_migrate import Migrate
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:superuser@localhost/Devzery'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = True
db = SQLAlchemy(app)
migrate = Migrate(app, db)
socketio = SocketIO(app, cors_allowed_origins="*")
logging.basicConfig(level=logging.DEBUG)


class TestCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    testcase_name = db.Column(db.String(255))
    module = db.Column(db.String(255))
    estimate_time = db.Column(db.Integer)  # Assuming estimate_time is in minutes
    priority = db.Column(db.String(50))  # Adjust the data type if needed
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def as_dict(self):
        return {
            "id": self.id,
            "testcase_name": self.testcase_name,
            "module": self.module,
            "estimate_time": self.estimate_time,
            "priority": self.priority,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

with app.app_context():
    db.create_all() 

@app.route('/')
def hello():
    return 'hey'

@app.route('/testcases', methods=['GET'])
def get_testcases():
    testcases = TestCase.query.all()
    return jsonify([tc.as_dict() for tc in testcases])

@app.route('/testcases', methods=['POST'])
def add_testcase():
    data = request.json
    new_testcase = TestCase(
        testcase_name=data['testcase_name'],
        module=data['module'],
        estimate_time=data['estimate_time'],
        priority=data['priority'],
        status=data['status']
    )
    db.session.add(new_testcase)
    db.session.commit()
    socketio.emit('new_testcase', new_testcase.as_dict())
    return jsonify(new_testcase.as_dict()), 201

@app.route('/testcases/<int:id>', methods=['PUT'])
def update_testcase(id):
    data = request.json
    testcase = TestCase.query.get(id)
    testcase.testcase_name = data.get('testcase_name', testcase.testcase_name)
    testcase.module = data.get('module', testcase.module)
    testcase.estimate_time = data.get('estimate_time', testcase.estimate_time)
    testcase.priority = data.get('priority', testcase.priority)
    testcase.status = data.get('status', testcase.status)  # Updated to handle string values
    db.session.commit()
    socketio.emit('update', testcase.as_dict())
    return jsonify(testcase.as_dict())


@socketio.on('connect')
def handle_connect():
    print('Client connected')

if __name__ == '__main__':
    socketio.run(app)
    
