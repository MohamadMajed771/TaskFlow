# TaskFlow

TaskFlow is a full-stack project management application designed to help teams organize projects, manage members, assign tasks, track progress, and collaborate through comments and notifications.

The application provides a project-based workspace where each project has an **Owner** and **Members**, with different permissions and responsibilities.

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected backend routes

### Project Management
- Create projects
- View projects from the user dashboard
- Project name, description, and deadline
- Owner and Member roles
- Delete projects
- Project-specific workspace

### Project Invitations
- Project owners can invite registered users
- Invitations appear in the user's dashboard
- Users can accept or decline invitations
- Accepted users automatically become project members

### Task Management
- Create tasks inside projects
- Assign tasks to project members
- Set task priority:
  - Low
  - Medium
  - High
- Set task due dates
- Task deadlines cannot exceed the project deadline
- Track tasks using three statuses:
  - To Do
  - In Progress
  - Done
- Project owners and assigned users can update task status

### Kanban Board
Tasks are organized into three columns:

- To Do
- In Progress
- Done

This makes it easy to follow the progress of the project.

### Comments
- Project members can comment on tasks
- Comments are displayed inside each task
- Task activity generates project notifications

### Notifications
TaskFlow includes a project notification system for events such as:

- Task assignment
- Task status changes
- Task completion
- New comments
- Overdue tasks
- Member leave requests

Unread notifications are tracked and displayed to users.

### Leave Request System
Instead of allowing members to leave a project immediately:

1. A member sends a leave request.
2. The project owner receives the request.
3. The owner can accept or decline it.
4. If accepted, the member is removed from the project.

This provides project owners with better control over team membership.

## Technologies

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Postman
- MySQL Workbench
- Git
- GitHub

## Project Structure

```text
TaskFlow/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── pages/
    │   └── styles/
    │
    └── package.json
```

## Architecture

The backend follows a layered architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MySQL Database
```

This separation helps keep the application organized and makes the code easier to maintain and extend.

## Security

TaskFlow implements several security and authorization mechanisms:

- Passwords are hashed before being stored.
- JWT tokens are used for authentication.
- Protected API routes require authentication.
- Project membership is validated before accessing project resources.
- Owner-only operations are protected on the backend.
- Task permissions are validated before updates.
- Environment variables are excluded from Git using `.gitignore`.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MohamadMajed771/TaskFlow.git
cd TaskFlow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file and configure the required database and JWT environment variables.

Then start the backend:

```bash
npm run dev
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React application will then run using the local Vite development server.

## Future Improvements

Possible future improvements include:

- Email notifications
- Real-time notifications using WebSockets
- Drag-and-drop task management
- File attachments
- User profile customization
- Project analytics and statistics
- Deployment to a cloud platform

## Author

**Mohamad Majed**

Software Engineering Student

GitHub: [MohamadMajed771](https://github.com/MohamadMajed771)

---

TaskFlow was developed as a full-stack portfolio project to practice modern web development, REST API design, authentication, database management, frontend development, and team/project management workflows.
