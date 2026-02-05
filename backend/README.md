# JOIN Backend — Django REST Framework API

RESTful API for the JOIN Kanban Board application built with Django 6.0 and Django REST Framework.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## About

The backend provides a complete **REST API** with:

- Token-based authentication
- CRUD operations for Tasks, Subtasks, and Contacts
- Advanced filtering, searching, and ordering
- PEP8-compliant, fully documented code
- Optimized database queries

---

## Features

### Authentication

- User registration with automatic contact creation
- Token-based authentication
- Secure password hashing
- Login/Logout with token management

### Task Management

- Full CRUD for tasks
- Nested subtasks with progress tracking
- Status updates (todo, inprogress, awaitfeedback, done)
- Priorities (urgent, medium, low)
- Team assignment via contacts
- Optimized queries with `prefetch_related`

### Contact Management

- Shared contacts for all users
- Email validation
- Search and filtering
- Automatic creation on registration

### Advanced Features

- **Filtering:** By status, priority, category
- **Searching:** Across title, description, category
- **Ordering:** By any field
- **Custom Actions:** `update_status`, `toggle_subtask`

---

## Tech Stack

| Technology            | Version | Purpose               |
| :-------------------- | :------ | :-------------------- |
| Python                | 3.13    | Programming Language  |
| Django                | 6.0.2   | Web Framework         |
| Django REST Framework | 3.14+   | REST API              |
| django-cors-headers   | 4.x     | CORS Handling         |
| python-decouple       | 3.x     | Environment Variables |
| django-filter         | 24.x    | Advanced Filtering    |

---

## Installation

### Prerequisites

- **Python** ≥ 3.13
- **pip** (comes with Python)
- **SQLite** (included with Python)

### Step 1: Clone the Project

```bash
git clone https://github.com/yourusername/join-fullstack.git
cd join-fullstack/backend
```

### Step 2: Create Virtual Environment

**Windows:**

```powershell
python -m venv .venv
.venv\Scripts\activate
```

**Linux/macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
```

**Generate a Secret Key:**

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

---

## Database Setup

### Run Migrations

```bash
python manage.py migrate
```

### Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to enter:

- Email
- Username
- Password

---

## Running the Server

### Start Development Server

```bash
python manage.py runserver
```

The server runs on: **http://localhost:8000**

### Admin Interface

Access the admin panel at: **http://localhost:8000/admin**

Login with your superuser credentials.

---

## API Endpoints

> **[Complete API Documentation](./API_DOCUMENTATION.md)** — Detailed endpoint reference with request/response examples, error handling, and integration tips.

### Quick Overview

**Authentication** (`/api/auth/`)

- `POST /api/auth/register/` — Register new user
- `POST /api/auth/login/` — Login user
- `POST /api/auth/logout/` — Logout user
- `GET /api/auth/me/` — Get current user

**Contacts** (`/api/contacts/`)

- `GET /api/contacts/` — List all contacts
- `POST /api/contacts/` — Create contact
- `GET /api/contacts/{id}/` — Get contact
- `PUT /api/contacts/{id}/` — Update contact
- `DELETE /api/contacts/{id}/` — Delete contact

**Tasks** (`/api/tasks/`)

- `GET /api/tasks/` — List all tasks
- `POST /api/tasks/` — Create task
- `GET /api/tasks/{id}/` — Get task
- `PUT /api/tasks/{id}/` — Update task
- `DELETE /api/tasks/{id}/` — Delete task
- `PATCH /api/tasks/{id}/update_status/` — Update status
- `PATCH /api/tasks/{id}/toggle_subtask/` — Toggle subtask

---

## Project Structure

```
backend/
├── core/                      # Project Configuration
│   ├── settings.py           # Django Settings
│   ├── urls.py               # URL Routing
│   ├── asgi.py               # ASGI Config
│   └── wsgi.py               # WSGI Config
│
├── users/                     # Users App
│   ├── models.py             # Custom User Model
│   ├── admin.py              # Admin Interface
│   └── api/
│       ├── views.py          # Auth Views (register, login, logout)
│       ├── serializers.py    # User Serializers
│       └── urls.py           # Auth URLs
│
├── contacts/                  # Contacts App
│   ├── models.py             # Contact Model
│   ├── admin.py              # Admin Interface
│   └── api/
│       ├── views.py          # ContactViewSet
│       ├── serializers.py    # ContactSerializer
│       └── urls.py           # Contact URLs
│
├── tasks/                     # Tasks App
│   ├── models.py             # Task & Subtask Models
│   ├── admin.py              # Admin Interface with Inlines
│   └── api/
│       ├── views.py          # TaskViewSet with Custom Actions
│       ├── serializers.py    # Task & Subtask Serializers
│       └── urls.py           # Task URLs
│
├── manage.py                  # Django Management Script
├── requirements.txt           # Python Dependencies
├── db.sqlite3                # SQLite Database (Development)
└── .env                      # Environment Variables (not in Git)
```

---

## Code Quality

### PEP8 Compliance

All Python files follow the **PEP8 Style Guide**.

### Code Standards

- ✅ **Functions max. 14 lines** — Complex logic extracted to helper functions
- ✅ **Docstrings everywhere** — All classes, methods, and functions documented
- ✅ **No debug code** — No `print()` statements or commented code
- ✅ **Type hints** — Where appropriate (for complex functions)
- ✅ **Single Responsibility** — Each function has exactly one task

---

## Deployment

### Production Checklist

1. **Disable DEBUG**

```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
```

2. **Generate secure SECRET_KEY**

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

3. **Collect static files**

```bash
python manage.py collectstatic
```

### Switch to PostgreSQL

```bash
pip install psycopg2-binary
```

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}
```

### Production Server

**Gunicorn** (recommended):

```bash
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

---

## Troubleshooting

### Port Already in Use

**Windows:**

```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**

```bash
lsof -ti:8000 | xargs kill -9
```

### Migration Errors

```bash
# Reset migrations for an app
python manage.py migrate --fake <app_name> zero
python manage.py migrate <app_name>
```

### Reset Database (Development Only)

```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## Resources

- [Complete API Documentation](./API_DOCUMENTATION.md)
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PEP8 Style Guide](https://pep8.org/)

---

> Built with Django REST Framework
