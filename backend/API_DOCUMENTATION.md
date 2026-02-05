# JOIN API Documentation

Complete REST API documentation for the JOIN Kanban Board backend.

**Base URL:** `http://localhost:8000/api`  
**Authentication:** Token-based (Header: `Authorization: Token <your-token>`)

---

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Logout](#logout)
  - [Current User](#current-user)
- [Contacts](#contacts)
  - [List Contacts](#list-contacts)
  - [Create Contact](#create-contact)
  - [Get Contact](#get-contact)
  - [Update Contact](#update-contact)
  - [Delete Contact](#delete-contact)
- [Tasks](#tasks)
  - [List Tasks](#list-tasks)
  - [Create Task](#create-task)
  - [Get Task](#get-task)
  - [Update Task](#update-task)
  - [Delete Task](#delete-task)
  - [Update Status](#update-task-status)
  - [Toggle Subtask](#toggle-subtask)
- [Error Handling](#error-handling)
- [Status Codes](#status-codes)

---

## Authentication

All endpoints (except Register and Login) require a valid token in the Authorization header:

```http
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

---

### Register

Creates a new user and associated contact.

**Endpoint:** `POST /api/auth/register/`  
**Auth Required:** No

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "name": "John Doe",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!",
  "accept_privacy_policy": true
}
```

#### Request Fields

| Field                   | Type    | Required | Description          |
| :---------------------- | :------ | :------: | :------------------- |
| `email`                 | string  |   Yes    | Unique email address |
| `name`                  | string  |   Yes    | Full name            |
| `password`              | string  |   Yes    | Minimum 8 characters |
| `confirm_password`      | string  |   Yes    | Must match password  |
| `accept_privacy_policy` | boolean |   Yes    | Must be `true`       |

#### Success Response

**Status:** `201 Created`

```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "username": "john.doe",
    "first_name": "",
    "last_name": "",
    "date_joined": "2026-02-05T10:30:00Z"
  },
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "createdAt": "2026-02-05T10:30:00Z"
}
```

#### Error Response

**Status:** `400 Bad Request`

```json
{
  "email": ["User with this email already exists."],
  "password": ["Passwords must match."],
  "accept_privacy_policy": ["You must accept the privacy policy."]
}
```

---

### Login

Authenticates a user and returns an auth token.

**Endpoint:** `POST /api/auth/login/`  
**Auth Required:** No

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Request Fields

| Field      | Type   | Required | Description      |
| :--------- | :----- | :------: | :--------------- |
| `email`    | string |   Yes    | Registered email |
| `password` | string |   Yes    | User password    |

#### Success Response

**Status:** `200 OK`

```json
{
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "username": "john.doe",
    "first_name": "",
    "last_name": "",
    "date_joined": "2026-02-05T10:30:00Z"
  },
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "createdAt": "2026-02-05T10:30:00Z"
}
```

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "error": "Invalid credentials"
}
```

---

### Logout

Deletes the current user's auth token.

**Endpoint:** `POST /api/auth/logout/`  
**Auth Required:** Yes

#### Request Body

No body required.

#### Success Response

**Status:** `200 OK`

```json
{
  "message": "Successfully logged out."
}
```

#### Error Response

**Status:** `400 Bad Request`

```json
{
  "error": "Not authenticated."
}
```

---

### Current User

Returns the currently authenticated user's data.

**Endpoint:** `GET /api/auth/me/`  
**Auth Required:** Yes

#### Success Response

**Status:** `200 OK`

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "name": "John Doe",
  "username": "john.doe",
  "first_name": "",
  "last_name": "",
  "date_joined": "2026-02-05T10:30:00Z",
  "createdAt": "2026-02-05T10:30:00Z"
}
```

---

## Contacts

Manage contacts that can be assigned to tasks.

---

### List Contacts

Returns a list of all contacts. Supports filtering, searching, and ordering.

**Endpoint:** `GET /api/contacts/`  
**Auth Required:** Yes

#### Query Parameters

| Parameter   | Type   | Description                                 | Example                   |
| :---------- | :----- | :------------------------------------------ | :------------------------ |
| `search`    | string | Search in firstname, lastname, email, phone | `?search=john`            |
| `email`     | string | Filter by exact email                       | `?email=john@example.com` |
| `firstname` | string | Filter by first name                        | `?firstname=John`         |
| `lastname`  | string | Filter by last name                         | `?lastname=Doe`           |
| `ordering`  | string | Ordering (prefix `-` for descending)        | `?ordering=-created_at`   |

#### Success Response

**Status:** `200 OK`

```json
[
  {
    "id": 1,
    "email": "john.doe@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "+49 123 456789",
    "created_at": "2026-02-05T10:30:00Z",
    "updated_at": "2026-02-05T10:30:00Z"
  },
  {
    "id": 2,
    "email": "jane.smith@example.com",
    "firstname": "Jane",
    "lastname": "Smith",
    "phone": "+49 987 654321",
    "created_at": "2026-02-05T11:00:00Z",
    "updated_at": "2026-02-05T11:00:00Z"
  }
]
```

---

### Create Contact

Creates a new contact.

**Endpoint:** `POST /api/contacts/`  
**Auth Required:** Yes

#### Request Body

```json
{
  "email": "max.mustermann@example.com",
  "firstname": "Max",
  "lastname": "Mustermann",
  "phone": "+49 111 222333"
}
```

#### Request Fields

| Field       | Type   | Required | Description                  |
| :---------- | :----- | :------: | :--------------------------- |
| `email`     | string |   Yes    | Unique email address         |
| `firstname` | string |   Yes    | First name (max. 100 chars)  |
| `lastname`  | string |    No    | Last name (max. 100 chars)   |
| `phone`     | string |   Yes    | Phone number (max. 50 chars) |

#### Success Response

**Status:** `201 Created`

```json
{
  "id": 3,
  "email": "max.mustermann@example.com",
  "firstname": "Max",
  "lastname": "Mustermann",
  "phone": "+49 111 222333",
  "created_at": "2026-02-05T12:00:00Z",
  "updated_at": "2026-02-05T12:00:00Z"
}
```

#### Error Response

**Status:** `400 Bad Request`

```json
{
  "email": ["Contact with this email already exists."]
}
```

---

### Get Contact

Returns a single contact.

**Endpoint:** `GET /api/contacts/{id}/`  
**Auth Required:** Yes

#### Success Response

**Status:** `200 OK`

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "phone": "+49 123 456789",
  "created_at": "2026-02-05T10:30:00Z",
  "updated_at": "2026-02-05T10:30:00Z"
}
```

#### Error Response

**Status:** `404 Not Found`

```json
{
  "detail": "Not found."
}
```

---

### Update Contact

Updates an existing contact.

**Endpoint:** `PUT /api/contacts/{id}/`  
**Auth Required:** Yes

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "firstname": "John",
  "lastname": "Doe Updated",
  "phone": "+49 999 888777"
}
```

#### Success Response

**Status:** `200 OK`

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "firstname": "John",
  "lastname": "Doe Updated",
  "phone": "+49 999 888777",
  "created_at": "2026-02-05T10:30:00Z",
  "updated_at": "2026-02-05T13:00:00Z"
}
```

---

### Delete Contact

Deletes a contact.

**Endpoint:** `DELETE /api/contacts/{id}/`  
**Auth Required:** Yes

#### Success Response

**Status:** `204 No Content`

No response body.

---

## Tasks

Manage tasks and subtasks.

---

### List Tasks

Returns a list of all tasks. Supports filtering, searching, and ordering.

**Endpoint:** `GET /api/tasks/`  
**Auth Required:** Yes

#### Query Parameters

| Parameter  | Type   | Description                            | Example                 |
| :--------- | :----- | :------------------------------------- | :---------------------- |
| `search`   | string | Search in title, description, category | `?search=implement`     |
| `status`   | string | Filter by status                       | `?status=todo`          |
| `priority` | string | Filter by priority                     | `?priority=urgent`      |
| `category` | string | Filter by category                     | `?category=Development` |
| `ordering` | string | Ordering                               | `?ordering=-created_at` |

**Status values:** `todo`, `inprogress`, `awaitfeedback`, `done`  
**Priority values:** `urgent`, `medium`, `low`

#### Success Response

**Status:** `200 OK`

```json
[
  {
    "id": "1",
    "title": "Implement User Authentication",
    "description": "Add login and registration functionality",
    "due_date": "2026-02-15T10:00:00Z",
    "priority": "urgent",
    "category": "Development",
    "status": "inprogress",
    "assigned_to": ["1", "2"],
    "subtasks": [
      {
        "id": "1",
        "title": "Create login form",
        "completed": true,
        "order": 0
      },
      {
        "id": "2",
        "title": "Add validation",
        "completed": false,
        "order": 1
      }
    ],
    "order": 0,
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T14:30:00Z"
  }
]
```

---

### Create Task

Creates a new task with optional subtasks.

**Endpoint:** `POST /api/tasks/`  
**Auth Required:** Yes

#### Request Body

```json
{
  "title": "Fix Bug in Navigation",
  "description": "Navigation menu not working on mobile devices",
  "due_date": "2026-02-20T15:00:00Z",
  "priority": "medium",
  "category": "Bug Fix",
  "status": "todo",
  "assigned_to": [1, 3],
  "subtasks": [
    {
      "title": "Reproduce bug",
      "completed": false,
      "order": 0
    },
    {
      "title": "Fix CSS",
      "completed": false,
      "order": 1
    },
    {
      "title": "Test on devices",
      "completed": false,
      "order": 2
    }
  ],
  "order": 5
}
```

#### Request Fields

| Field         | Type              | Required | Description                                                     |
| :------------ | :---------------- | :------: | :-------------------------------------------------------------- |
| `title`       | string            |   Yes    | Task title (max. 255 chars)                                     |
| `description` | string            |    No    | Detailed description                                            |
| `due_date`    | string (ISO 8601) |   Yes    | Due date                                                        |
| `priority`    | string            |    No    | `urgent`, `medium`, `low` (default: `medium`)                   |
| `category`    | string            |   Yes    | Category (max. 100 chars)                                       |
| `status`      | string            |    No    | `todo`, `inprogress`, `awaitfeedback`, `done` (default: `todo`) |
| `assigned_to` | array[int]        |    No    | Contact IDs                                                     |
| `subtasks`    | array[object]     |    No    | List of subtasks                                                |
| `order`       | int               |    No    | Order within column                                             |

**Subtask fields:**

- `title` (string, required): Subtask title
- `completed` (boolean, optional): Default `false`
- `order` (int, optional): Order

#### Success Response

**Status:** `201 Created`

```json
{
  "id": "5",
  "title": "Fix Bug in Navigation",
  "description": "Navigation menu not working on mobile devices",
  "due_date": "2026-02-20T15:00:00Z",
  "priority": "medium",
  "category": "Bug Fix",
  "status": "todo",
  "assigned_to": ["1", "3"],
  "subtasks": [
    {
      "id": "15",
      "title": "Reproduce bug",
      "completed": false,
      "order": 0
    },
    {
      "id": "16",
      "title": "Fix CSS",
      "completed": false,
      "order": 1
    },
    {
      "id": "17",
      "title": "Test on devices",
      "completed": false,
      "order": 2
    }
  ],
  "order": 5,
  "created_at": "2026-02-05T15:00:00Z",
  "updated_at": "2026-02-05T15:00:00Z"
}
```

---

### Get Task

Returns a single task with all details.

**Endpoint:** `GET /api/tasks/{id}/`  
**Auth Required:** Yes

#### Success Response

**Status:** `200 OK`

```json
{
  "id": "1",
  "title": "Implement User Authentication",
  "description": "Add login and registration functionality",
  "due_date": "2026-02-15T10:00:00Z",
  "priority": "urgent",
  "category": "Development",
  "status": "inprogress",
  "assigned_to": ["1", "2"],
  "subtasks": [
    {
      "id": "1",
      "title": "Create login form",
      "completed": true,
      "order": 0
    }
  ],
  "order": 0,
  "created_at": "2026-02-05T10:00:00Z",
  "updated_at": "2026-02-05T14:30:00Z"
}
```

---

### Update Task

Updates an existing task. Subtasks are completely replaced.

**Endpoint:** `PUT /api/tasks/{id}/`  
**Auth Required:** Yes

#### Request Body

```json
{
  "title": "Implement User Authentication - Updated",
  "description": "Add login, registration and password reset",
  "due_date": "2026-02-18T10:00:00Z",
  "priority": "urgent",
  "category": "Development",
  "status": "done",
  "assigned_to": [1, 2, 3],
  "subtasks": [
    {
      "title": "Create login form",
      "completed": true,
      "order": 0
    },
    {
      "title": "Add validation",
      "completed": true,
      "order": 1
    },
    {
      "title": "Add password reset",
      "completed": true,
      "order": 2
    }
  ],
  "order": 0
}
```

#### Success Response

**Status:** `200 OK`

Returns the updated task (see Create Task Response).

---

### Update Task Status

Updates only the status of a task (optimized for Drag & Drop).

**Endpoint:** `PATCH /api/tasks/{id}/update_status/`  
**Auth Required:** Yes

#### Request Body

```json
{
  "status": "done"
}
```

**Allowed status values:** `todo`, `inprogress`, `awaitfeedback`, `done`

#### Success Response

**Status:** `200 OK`

```json
{
  "id": "1",
  "title": "Implement User Authentication",
  "status": "done",
  ...
}
```

#### Error Response

**Status:** `400 Bad Request`

```json
{
  "error": "Invalid status"
}
```

---

### Toggle Subtask

Toggles the `completed` status of a subtask.

**Endpoint:** `PATCH /api/tasks/{id}/toggle_subtask/`  
**Auth Required:** Yes

#### Request Body

```json
{
  "subtask_id": 5
}
```

**Note:** `subtask_id` must be sent as an integer (converted from string to int by the frontend).

#### Success Response

**Status:** `200 OK`

Returns the complete task with updated subtask.

```json
{
  "id": "1",
  "title": "Implement User Authentication",
  "subtasks": [
    {
      "id": "5",
      "title": "Add validation",
      "completed": true,
      "order": 1
    }
  ],
  ...
}
```

#### Error Response

**Status:** `404 Not Found`

```json
{
  "error": "Subtask not found"
}
```

---

### Delete Task

Deletes a task and all associated subtasks.

**Endpoint:** `DELETE /api/tasks/{id}/`  
**Auth Required:** Yes

#### Success Response

**Status:** `204 No Content`

No response body.

---

## Error Handling

### Authentication Errors

**Status:** `401 Unauthorized`

```json
{
  "detail": "Authentication credentials were not provided."
}
```

oder

```json
{
  "detail": "Invalid token."
}
```

**Solution:** Refresh token by logging in again.

---

### Validation Errors

**Status:** `400 Bad Request`

```json
{
  "field_name": ["Error message describing the issue."]
}
```

**Example:**

```json
{
  "email": ["This field is required."],
  "due_date": [
    "Datetime has wrong format. Use one of these formats instead: YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]."
  ]
}
```

---

### Resource Not Found

**Status:** `404 Not Found`

```json
{
  "detail": "Not found."
}
```

---

### Server Errors

**Status:** `500 Internal Server Error`

```json
{
  "detail": "Internal server error."
}
```

**Note:** For 500 errors, check server logs.

---

## Status Codes

| Code  | Meaning               | Usage                                  |
| :---: | :-------------------- | :------------------------------------- |
| `200` | OK                    | Successful GET/PUT/PATCH requests      |
| `201` | Created               | Resource successfully created (POST)   |
| `204` | No Content            | Resource successfully deleted (DELETE) |
| `400` | Bad Request           | Validation errors, invalid data        |
| `401` | Unauthorized          | Missing or invalid authentication      |
| `403` | Forbidden             | No permission for this action          |
| `404` | Not Found             | Resource does not exist                |
| `500` | Internal Server Error | Server error                           |

---

## Integration Tips

### 1. Token Management

```typescript
// Store token after login
localStorage.setItem('authToken', response.token);

// Add token to requests
headers: {
  'Authorization': `Token ${localStorage.getItem('authToken')}`
}
```

### 2. Error Handling

```typescript
try {
  const response = await fetch('/api/tasks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Validation errors:', error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 3. DateTime Format

Always use ISO 8601 format:

```javascript
const dueDate = new Date('2026-02-15T10:00:00Z').toISOString();
// "2026-02-15T10:00:00.000Z"
```

### 4. ID Conversion

Backend sends IDs as strings, convert to integer for POST/PUT:

```typescript
// Frontend → Backend
assigned_to: contactIds.map((id) => parseInt(id, 10));

// Backend → Frontend
assigned_to: response.assigned_to.map((id) => String(id));
```

---

## Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [ISO 8601 DateTime Format](https://en.wikipedia.org/wiki/ISO_8601)

---

**Tip:** Use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test API endpoints.

---

**Version:** 1.0  
**Last Updated:** February 5, 2026
