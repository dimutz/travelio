# Travelio

Travelio is a full-stack property booking platform built with a Django REST API backend and a React frontend. Users can register/login, search properties, and (for `owner` accounts) create new property listings.

## Tech Stack

- Backend: Django, Django REST Framework, SimpleJWT, PostgreSQL
- Frontend: React, React Router, Axios

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- PostgreSQL 14+ (or compatible)

## Backend Setup

1. Go to backend directory:
   - `cd backend`
2. Create and activate a virtual environment:
   - `python -m venv venv`
   - `source venv/bin/activate`
3. Install dependencies:
   - `pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary django-cors-headers`
4. Create PostgreSQL database and user (matching current settings):
   - Database: `travelio`
   - User: `travelio_user`
   - Password: `travelio_pass`
   - Host: `localhost`
   - Port: `5432`
5. Run migrations:
   - `python manage.py migrate`
6. Start backend server:
   - `python manage.py runserver`

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup

1. Open a new terminal and go to frontend directory:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Start frontend:
   - `npm start`

Frontend runs at `http://localhost:3000`.

## How to Use

1. Open `http://localhost:3000`.
2. Register a new user (`client`, `owner`, or `receptionist`).
3. Login with username + password.
4. After login, you are redirected to the protected home page where you can search properties.
5. If logged in as `owner`, use **Add property** to create listings.

## Notes

- Auth uses JWT tokens stored in browser local storage.
- Protected routes are enforced in the frontend.
