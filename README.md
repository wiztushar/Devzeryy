# Test Case Management Application

This is a web application for managing test cases. It allows users to add, edit, and view test cases with details such as name, module, estimate time, priority, and status. The frontend is built with React, and the backend is powered by Flask with a PostgreSQL database.

## Features

- **Add New Test Cases**: Create and add new test cases to your project.
- **Edit Existing Test Cases**: Update details of existing test cases.
- **View Test Cases**: Display all test cases in a user-friendly table format.
- **Real-Time Updates**: Enjoy real-time updates using Socket.IO.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: PostgreSQL
- **Real-Time Communication**: Socket.IO

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v14 or later)
- npm
- Python (v3.7 or later)
- PostgreSQL
- pipenv

## Setup Instructions

### Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/yourusername/test-case-management.git
cd test-case-management
```


## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies using pipenv:

```
pipenv install
```
3. Activate the pipenv shell:

```
pipenv shell
```

## Set up the PostgreSQL database:

1. Create a new database named projectdata.

2. Update the SQLALCHEMY_DATABASE_URI in app.py to match your database credentials:(Python)

```
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:superuser@localhost/Devzery'
```

3. Initialize the database in bash:

```
flask db upgrade
```


4. Run the Flask server:

```
flask run
```
This will start the Backend application on http://localhost:5000.

## Frontend Setup

1.Navigate to the frontend directory:
```
cd frontend
```

2.Install Node.js dependencies:
```
npm install
```
3.Start the React development server:
```
npm start 
```

This will start the frontend application on http://localhost:3000.

## Usage

- Add a Test Case: Fill in the form on the homepage and click the "Add Test Case" button.

- Edit a Test Case: Click the "Edit" button next to a test case to update its details.
  
- Edit a Test Case: Click the "Edit" button next to a test case to update its details.

- View Test Cases: All test cases are displayed in a table format.
