# JOIN Frontend — Angular Kanban Board

Modern, responsive frontend for the JOIN Kanban Board application built with **Angular 19**.

<p align="center">
  <img alt="Angular" src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="SCSS" src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
  <img alt="RxJS" src="https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" />
</p>

---

## About

**JOIN Frontend** is a modern Single-Page Application (SPA) that communicates with the Django REST Framework backend.  
The application provides an intuitive user interface for task management with **Drag & Drop**, **real-time updates**, and **responsive design**.

---

## Highlights

| Feature              | Description                                              |
| :------------------- | :------------------------------------------------------- |
| 🔐 **Security**      | Token-based authentication with HTTP Interceptors        |
| 🎨 **UI/UX**         | Modern, responsive layout with animations                |
| ⚡ **Performance**   | Lazy Loading, OnPush Change Detection, Optimized Queries |
| 🧩 **Modular**       | Standalone Components, Feature Module structure          |
| ♿ **Accessibility** | Keyboard Navigation, ARIA-Labels                         |

---

## ✨ Features

### 🎯 Kanban Board

- **4 Columns:** To Do, In Progress, Await Feedback, Done
- **Drag & Drop** with Angular CDK
- Visual feedback animations
- Task filter and search
- Priority indicators with color coding

### 📝 Task Management

- Create, Read, Update, Delete (CRUD)
- Subtasks with progress tracking
- Assign team members
- Categories and priorities
- **File attachments** (JPEG/PNG, up to 5 files, max. 1 MB)
  - Drag & Drop upload with Canvas compression to 800px
  - Thumbnails with individual and bulk removal
- **Image viewer** with zoom, download and image navigation
- Modal for detailed view

### 👥 Contacts Dashboard

- Contact management (CRUD)
- Avatar generation from initials
- Sorting and filtering
- Quick assignment to tasks

### 🔐 Authentication

- Registration with validation
- Login with token persistence
- Auto-logout on invalid token
- Auth Guards for protected routes

---

## Tech Stack

**Core**

- Angular 19 (Standalone Components, Signals API)
- TypeScript 5.5
- RxJS 7.8
- Angular Router

**UI/UX**

- SCSS (Custom Variables, Mixins)
- Angular Animations
- Angular CDK (Drag & Drop)
- Responsive Design (Mobile-First)

**State Management**

- Services with BehaviorSubject
- Signals API for reactive states
- HTTP Client with Interceptors

**Backend Integration**

- REST API Communication
- Token-based authentication
- Error handling & retry logic
- Type-safe API responses

---

## Installation

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Angular CLI** ≥ 19.x

### Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve

# Open http://localhost:4200
```

### Environment Configuration

The API URL is configured in the environment files:

**Development** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
};
```

**Production** (`src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
};
```

---

## Architecture

### Project Structure

```
frontend/src/app/
├── core/                          # Singleton Services & Guards
│   ├── guards/
│   │   ├── auth-guard.ts         # Protects authenticated routes
│   │   └── logged-in-guard.ts    # Prevents double login
│   ├── interceptors/
│   │   └── auth.interceptor.ts   # Adds token to requests
│   ├── interfaces/
│   │   ├── board-tasks-interface.ts
│   │   ├── db-contact-interface.ts
│   │   └── users-interface.ts
│   └── services/
│       ├── auth-service.ts       # Authentication & user management
│       ├── board-tasks-service.ts # Task CRUD & state
│       ├── db-contact-service.ts  # Contact CRUD & state
│       └── animation-state.service.ts
│   └── utils/
│       └── attachment-utils.ts   # Compression, validation & Base64 encoding
│
├── features/                      # Feature modules
│   ├── board/                    # Kanban board
│   │   ├── board.ts              # Main board component
│   │   ├── board-header/         # Header with search & add
│   │   ├── board-columns/        # Columns with drag & drop
│   │   ├── task-card/            # Task card component
│   │   │   ├── task-card-modal/  # Detail modal
│   │   │   └── task-card-edit/   # Edit form
│   │   └── add-task-modal/       # Create new task
│   │
│   ├── contacts/                 # Contact management
│   ├── summary/                  # Dashboard
│   ├── add-task/                 # Task creation (standalone)
│   ├── landing-page/             # Login/Register
│   ├── help/                     # Help page
│   ├── legal-notice/             # Legal notice
│   └── privacy-policy/           # Privacy policy
│
├── shared/                        # Reusable components
│   └── components/
│       ├── attachment-upload/    # Drag & Drop file upload with preview
│       ├── image-viewer/         # Full-screen image viewer
│       └── priority-icon/        # Priority indicator
│
├── app.config.ts                 # App configuration
├── app.routes.ts                 # Routing configuration
└── app.ts                        # Root component
```

### Design Patterns

#### Service Layer Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class BoardTasksService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  async updateTask(taskId: string, updates: Partial<Task>) {
    await this.http.put(`${this.apiUrl}${taskId}/`, updates).toPromise();
    await this.loadTasks(); // Refresh state
  }
}
```

#### Smart vs. Dumb Components

- **Smart Components:** board.ts, contacts.ts (manage state)
- **Dumb Components:** task-card, priority-icon (presentation only)

#### Reactive Programming

```typescript
this.taskService.tasks$.subscribe((tasks) => {
  this.filteredTasks = this.filterTasks(tasks);
});
```

---

## Authentication

### Auth Flow

1. **Login:** User sends credentials → receives token
2. **Token Storage:** Token is stored in `localStorage`
3. **Auto-Include:** Interceptor adds token to all API requests
4. **Route Guards:** Protect private routes
5. **Auto-Logout:** Automatically log out on 401 error

### Auth Interceptor

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = this.authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
  }
  return next.handle(req);
}
```

### Route Guards

```typescript
// auth-guard.ts - Protects Board, Contacts, etc.
canActivate() {
  return this.authService.isAuthenticated();
}

// logged-in-guard.ts - Prevents login page when logged in
canActivate() {
  return !this.authService.isAuthenticated();
}
```

---

## Styling

### SCSS Architecture

```scss
// Global variables
$primary-color: #2a3647;
$accent-color: #29abe2;
$urgent-color: #ff3d00;
$medium-color: #ffa800;
$low-color: #7ae229;

// Mixins for responsive design
@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 769px) and (max-width: 1024px) {
    @content;
  }
}
```

### Component-Scoped Styles

Each component has its own `.scss` file with specific styles.

---

## API Integration

### Backend Communication

All services use `HttpClient` for backend communication:

```typescript
// Create task
async createTask(task: Omit<Task, 'id' | 'createdAt'>) {
  const apiTask = this.convertFrontendTaskToApi(task);
  const response = await this.http.post<TaskApiResponse>(
    this.apiUrl,
    apiTask
  ).toPromise();
  await this.loadTasks();
  return response.id;
}
```

### Format Conversion

Frontend ↔ Backend format conversion:

```typescript
// Frontend: dueDate (Timestamp) → Backend: due_date (ISO String)
// Frontend: assignedTo (string[]) → Backend: assigned_to (number[])
// Frontend: subtasks → Backend: subtasks with order
```

---

## Development

### Dev Server

```bash
ng serve
# Runs on http://localhost:4200
# Live reload on file changes
```

### Build

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

### Code Quality

```bash
# Linting
ng lint

# Type checking
tsc --noEmit
```

---

## Production Build & Deployment

### Optimized Build

```bash
ng build --configuration production --aot --build-optimizer
```

**Optimizations:**

- Ahead-of-Time (AOT) Compilation
- Tree Shaking
- Minification & Uglification
- Source Maps (optionally disable)
- Lazy Loading

### Deployment Options

#### 1. Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### 2. Netlify

- Push to GitHub
- Connect Netlify to repository
- Build Command: `ng build --configuration production`
- Publish Directory: `dist/frontend/browser`

#### 3. Nginx (Custom Server)

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/join/dist/frontend;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Author

**Daniel Luzius**  
[danielluzius.de](https://danielluzius.de)

---

## Acknowledgments

- [Angular Team](https://angular.io)
- [Django Software Foundation](https://www.djangoproject.com)
- [Django REST Framework](https://www.django-rest-framework.org)
- [Developer Akademie](https://www.developer-akademie.de)

---

> Built with Angular 19
