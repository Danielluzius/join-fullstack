# JOIN — Fullstack Kanban Project Management

A modern, collaborative task management application built with **Angular 19** and **Django REST Framework**.

<p align="center">
  <img alt="Angular" src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img alt="Django" src="https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img alt="DRF" src="https://img.shields.io/badge/DRF-3.14-ff1709?style=for-the-badge&logo=django&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

---

## About

**JOIN** is a complete **Kanban Board System** with Angular frontend and Django REST API backend.  
Teams can manage tasks, organize contacts, and collaborate in real-time.

### Architecture

```
join-fullstack/
├── frontend/          # Angular 19 SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Services, Guards, Interceptors
│   │   │   ├── features/      # Board, Contacts, Tasks
│   │   │   └── shared/        # Reusable Components
│   └── README.md
│
├── backend/           # Django REST Framework API
│   ├── core/          # Project Settings
│   ├── users/         # User Authentication
│   ├── contacts/      # Contact Management
│   ├── tasks/         # Task & Subtask Models
│   └── README.md
│
└── README.md          # This file
```

---

## Features

### Kanban Board

- **4 Columns:** To Do, In Progress, Await Feedback, Done
- **Drag & Drop** with Angular CDK
- **Real-time Updates** via Django Channels (optional)
- **Smart Search** and filtering
- **Priority Levels:** Urgent, Medium, Low

### Task Management

- Subtasks with progress tracking
- Assign team members
- Categories and tags
- Due dates
- File attachments (JPEG/PNG, up to 5 files, max. 1 MB total)
- Image viewer with zoom, download and navigation
- Full CRUD operations

### Contact Management

- Contact database with CRUD
- Avatar generation from initials
- Assignment to tasks

### Authentication

- Token-based Auth (Django REST Framework)
- Secure password hashing
- Auth Guards and Interceptors
- Automatic token handling

---

## Tech Stack

### Frontend

- **Framework:** Angular 19 (Standalone Components)
- **Language:** TypeScript 5.5
- **Styling:** SCSS
- **State Management:** RxJS, Signals API
- **UI Features:** Angular CDK (Drag & Drop), Animations
- **HTTP Client:** HttpClient with Interceptors

### Backend

- **Framework:** Django 6.0
- **API:** Django REST Framework 3.14
- **Database:** SQLite (Development), PostgreSQL (Production ready)
- **Authentication:** Token Authentication
- **CORS:** django-cors-headers
- **Code Quality:** PEP8-compliant, fully documented

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.13
- **npm** ≥ 9.x
- **Angular CLI** ≥ 19.x

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file
# See backend/README.md for details

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
# Backend runs on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
# Frontend runs on http://localhost:4200
```

### First Steps

1. Open http://localhost:4200
2. Register a new user
3. Create contacts
4. Create and manage tasks on the board

---

## 📚 Documentation

- **[Backend Documentation](./backend/README.md)** — Django API Setup & Endpoints
- **[API Documentation](./backend/API_DOCUMENTATION.md)** — Complete REST API Reference
- **[Frontend Documentation](./frontend/README.md)** — Angular App Structure & Components

---

## Code Quality

### Backend

- ✅ **PEP8-compliant** — Python Style Guide
- ✅ **Functions max. 14 lines** — Clean Code principles
- ✅ **Fully documented** — Docstrings for all classes/methods
- ✅ **No debug code** — No print() or commented code blocks

### Frontend

- ✅ **TypeScript Strict Mode**
- ✅ **Angular Best Practices**
- ✅ **Component-based Architecture**
- ✅ **Reactive Programming with RxJS**

---

## API Endpoints

> **[Complete API Documentation](./backend/API_DOCUMENTATION.md)** — Detailed Request/Response examples, error handling and integration tips

### Authentication

- `POST /api/auth/register/` — Register user
- `POST /api/auth/login/` — Login user
- `POST /api/auth/logout/` — Logout user
- `GET /api/auth/me/` — Current user

### Contacts

- `GET /api/contacts/` — List all contacts
- `POST /api/contacts/` — Create contact
- `GET /api/contacts/{id}/` — Get contact
- `PUT /api/contacts/{id}/` — Update contact
- `DELETE /api/contacts/{id}/` — Delete contact

### Tasks

- `GET /api/tasks/` — List all tasks
- `POST /api/tasks/` — Create task
- `GET /api/tasks/{id}/` — Get task
- `PUT /api/tasks/{id}/` — Update task
- `DELETE /api/tasks/{id}/` — Delete task
- `PATCH /api/tasks/{id}/update_status/` — Update status
- `PATCH /api/tasks/{id}/toggle_subtask/` — Toggle subtask

---

## Team

**Daniel Luzius**  
[danielluzius.de](https://danielluzius.de)

**Kajanan Yoganathan**  
[kajanan.dev](https://kajanan.dev)

**Patrick Schmidt**  
[patrick-schmidt.info](https://patrick-schmidt.info)

---

## License

This project was created as part of the **Developer Akademie** program.

---

## Acknowledgments

- [Angular Team](https://angular.io)
- [Django Software Foundation](https://www.djangoproject.com)
- [Django REST Framework](https://www.django-rest-framework.org)
- [Developer Akademie](https://www.developer-akademie.de)

---

> Made with ❤️ in Germany
