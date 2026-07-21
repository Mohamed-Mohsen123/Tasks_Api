# Tasks API

A RESTful API built with **Node.js** and **Express** for managing tasks. Supports creating, reading, updating, and deleting tasks with input validation middleware and a dedicated service layer. Uses **MongoDB** with **Mongoose** ODM for persistent data storage and **crypto UUID** for unique task identifiers. Includes user registration/sign-in with **bcrypt** password hashing and **JWT**-based authentication for protected routes. All responses follow the **JSend** format and errors are handled centrally via a global error handler.

---

## Project Structure

```
tasks-api/
├── controllers/
│   ├── tasks.controller.js        # Request handlers (delegates to services)
│   └── users.controller.js        # Request handlers for auth/user endpoints
├── middlewares/
│   ├── asyncwrapper.middleware.js # Wraps async handlers, forwards errors to next()
│   ├── auth.middleware.js         # Verifies JWT from Authorization header
│   ├── isAdmin.js                 # Middleware requiring req.user.role === "admin"
│   ├── tasks.middlwares.js        # Validation schemas & error handling (tasks)
│   ├── upload.middleware.js       # Multer config: image-only, 5MB limit, saves to uploads/
│   └── users.middlewares.js       # Validation schemas & error handling (users)
├── models/
│   ├── tasks.model.js             # Mongoose schema & model definition
│   └── users.model.js             # Mongoose schema & model definition (users)
├── routes/
│   ├── tasks.routes.js            # Route definitions
│   └── users.routes.js            # Route definitions (register, signin, get users)
├── services/
│   ├── tasks.services.js          # Business logic & database operations
│   └── users.services.js          # Business logic for register/sign-in/list users
├── utils/
│   ├── appError.js                # Custom AppError class
│   ├── httpStatusText.js          # JSend status constants (SUCCESS, FAIL, ERROR)
│   └── token.js                   # JWT creation helper (createToken)
├── uploads/                       # Uploaded profile photos (gitignored)
├── server.js                      # App entry point, MongoDB connection & global handlers
├── .env                           # Environment variables (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN)
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (for DB connection)

### Installation

```bash
git clone <your-repo-url>
cd tasks-api
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tasks
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
```

For MongoDB Atlas, use a connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Tasks_DB?retryWrites=true&w=majority
```

### Running the Server

```bash
node server.js
```

The server starts on the port defined in `.env` (default **3000**) and connects to MongoDB:

```
MongoDB connected successfully
Server running on port 3000
```

---

## Tech Stack

| Package             | Version  | Purpose                            |
| ------------------- | -------- | ---------------------------------- |
| `express`           | ^5.2.1   | HTTP server & routing              |
| `express-validator` | ^7.3.2   | Request validation                 |
| `mongoose`          | ^9.6.3   | MongoDB ODM & schema validation    |
| `mongodb`           | ^6.x.x   | MongoDB driver                     |
| `cors`              | ^2.x.x   | Cross-origin resource sharing      |
| `dotenv`            | ^17.4.2  | Environment variable loading       |
| `bcryptjs`          | ^3.0.3   | Password hashing                   |
| `jsonwebtoken`      | ^9.0.3   | JWT creation & verification        |
| `multer`            | ^2.2.0   | Multipart form parsing & image upload |
| `crypto`            | Built-in | UUID generation for task/user IDs  |

---

## Response Format (JSend)

All API responses follow the **JSend** specification with a consistent envelope:

**Success**
```json
{
  "status": "sucsses",
  "data": { ... }
}
```

**Fail** (client error, e.g. 400, 404)
```json
{
  "status": "fail",
  "data": { "message": "description of the problem" }
}
```

**Error** (server error, e.g. 500)
```json
{
  "status": "error",
  "data": { "message": "internal server error" }
}
```

---

## API Reference

All endpoints are prefixed with `/tasksApi`.

User endpoints are prefixed with `/usersApi`.

### Register a User

```
POST /usersApi/register
```

Accepts either `application/json` or `multipart/form-data`. Use `multipart/form-data` to optionally attach a profile photo via the `photo` field — only image files are accepted (validated by MIME type), max 5MB, and are stored on disk in `uploads/`.

**Request Body**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure-password"
}
```

Or, as `multipart/form-data`: `name`, `email`, `password` fields plus an optional `photo` file field.

**Response** `201 Created`

```json
{
  "status": "sucsses",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "photo": "uploads/<generated-filename>.png"
    },
    "token": "eyJ..."
  }
}
```

`photo` is `null` when no file was uploaded. Uploaded files are served statically at `GET /uploads/<filename>`.

**Error** `400 Bad Request` — e.g. duplicate email

```json
{
  "status": "fail",
  "data": { "message": "email already exists" }
}
```

**Error** `400 Bad Request` — non-image file uploaded as `photo`

```json
{
  "status": "fail",
  "data": { "message": "only image files are allowed" }
}
```

---

### Sign In

```
POST /usersApi/signin
```

**Request Body**

```json
{
  "email": "jane@example.com",
  "password": "secure-password"
}
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    },
    "token": "eyJ..."
  }
}
```

**Error** `401 Unauthorized`

```json
{
  "status": "fail",
  "data": { "message": "invalid email or password" }
}
```

---

### Get All Users 🔒

```
GET /usersApi/
```

Requires a valid JWT — see [Authentication](#authentication).

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "users": [
      { "name": "Jane Doe", "email": "jane@example.com", "createdAt": "...", "updatedAt": "..." }
    ]
  }
}
```

**Error** `401 Unauthorized`

```json
{
  "status": "fail",
  "data": { "message": "no token provided" }
}
```

---

## Authentication

User endpoints issue a **JWT** on register/sign-in. Protected endpoints require it in the `Authorization` header:

```
Authorization: Bearer <token>
```

- Tokens are signed with `JWT_SECRET` and expire after `JWT_EXPIRES_IN` (default `1d`), both read from `.env`. The signed payload includes the user's `id`, `email`, and `role`.
- `utils/token.js` exposes `createToken(user)`, used by `registerUser` and `signIn` in `services/users.services.js`.
- `middlewares/auth.middleware.js` verifies the token, attaches the decoded payload to `req.user`, and forwards a `401` `AppError` (`no token provided` / `invalid or expired token`) when verification fails.
- Token verification is applied **globally** in `server.js` to every route except the public paths `POST /usersApi/register` and `POST /usersApi/signin`.
- `middlewares/isAdmin.js` additionally requires `req.user.role === "admin"` on top of a valid token, forwarding a `403` `AppError` (`admin access required`) otherwise. Currently applied to `DELETE /tasksApi/:task_id`.
- Every user has a `role` of `"admin"` or `"user"` (default `"user"`), stored on the user model and validated on register.

---

### Get All Tasks

```
GET /tasksApi/
```

Supports **pagination** via query parameters:

| Query Param | Type   | Default | Description                    |
| ----------- | ------ | ------- | ------------------------------ |
| `limit`     | number | `2`     | Number of tasks per page       |
| `page`      | number | `1`     | Page number (1-indexed)        |

**Example**
```
GET /tasksApi/?limit=5&page=2
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "tasks": [
      { "id": "uuid", "title": "Buy groceries" },
      { "id": "uuid", "title": "Write report" }
    ]
  }
}
```

---

### Get a Task by ID

```
GET /tasksApi/:task_id
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "task": { "id": "uuid", "title": "Buy groceries" }
  }
}
```

**Error** `404 Not Found`

```json
{
  "status": "fail",
  "data": { "message": "task not found (wrong id number)" }
}
```

---

### Get a Task by Title

```
GET /tasksApi/title/:task_title
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "task": { "id": "uuid", "title": "Buy groceries" }
  }
}
```

**Error** `404 Not Found`

```json
{
  "status": "fail",
  "data": { "message": "task not found (wrong title)" }
}
```

---

### Create a Task

```
POST /tasksApi/
```

**Request Body**

```json
{
  "title": "New task title"
}
```

**Response** `201 Created`

```json
{
  "status": "sucsses",
  "data": {
    "task": { "id": "uuid", "title": "New task title" }
  }
}
```

**Error** `400 Bad Request` — e.g. duplicate title

```json
{
  "status": "fail",
  "data": { "message": "duplicated title" }
}
```

---

### Update a Task (Partial)

```
PATCH /tasksApi/:task_id
```

Updates only the `title` of the task.

**Request Body**

```json
{
  "title": "Updated title"
}
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "task": { "id": "uuid", "title": "Updated title" }
  }
}
```

**Error** `404 Not Found`

```json
{
  "status": "fail",
  "data": { "message": "task not found (wrong id number)" }
}
```

---

### Replace a Task (Full)

```
PUT /tasksApi/:task_id
```

Fully replaces the task data while preserving the original ID.

**Request Body**

```json
{
  "title": "Replaced task title"
}
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": {
    "task": { "id": "uuid", "title": "Replaced task title" }
  }
}
```

**Error** `404 Not Found`

```json
{
  "status": "fail",
  "data": { "message": "task not found (wrong id number)" }
}
```

---

### Delete a Task 🔒 (admin only)

```
DELETE /tasksApi/:task_id
```

Requires a valid JWT for a user with `role: "admin"` — see [Authentication](#authentication).

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": null
}
```

**Error** `403 Forbidden` — caller is not an admin

```json
{
  "status": "fail",
  "data": { "message": "admin access required" }
}
```

**Error** `404 Not Found`

```json
{
  "status": "fail",
  "data": { "message": "task not found (wrong id number)" }
}
```

---

## Validation Rules

Powered by [`express-validator`](https://express-validator.github.io/). Validation runs before any controller logic via `handleValidationErrors` middleware.

| Endpoint                 | Field                | Rules                      |
| ------------------------ | -------------------- | -------------------------- |
| `POST /`                 | `title` (body)       | Required, min 3 characters |
| `GET /:task_id`          | `task_id` (param)    | Valid UUID                 |
| `GET /title/:task_title` | `task_title` (param) | Required                   |
| `PATCH /:task_id`        | `task_id` (param)    | Valid UUID                 |
|                          | `title` (body)       | Required, min 3 characters |
| `PUT /:task_id`          | `task_id` (param)    | Valid UUID                 |
|                          | `title` (body)       | Required, min 3 characters |
| `DELETE /:task_id`       | `task_id` (param)    | Valid UUID                 |

**User endpoints** (`/usersApi`)

| Endpoint         | Field            | Rules                              |
| ----------------- | ---------------- | ----------------------------------- |
| `POST /register`  | `name` (body)    | Required, min 3 characters          |
|                    | `email` (body)   | Required, valid email               |
|                    | `password` (body)| Required, min 6 characters          |
| `POST /signin`    | `email` (body)   | Required, valid email               |
|                    | `password` (body)| Required                            |

**Validation error response** `400 Bad Request`

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Title must be at least 3 characters long",
      "path": "title",
      "location": "body"
    }
  ]
}
```

---

## Error Handling Architecture

Errors flow through a centralized pipeline instead of being handled inline in each controller.

```
Controller detects error
        │
        ▼
next(new AppError(message, statusCode, status))
        │
        ▼
asyncWrapper catches any uncaught async rejections → next(e)
        │
        ▼
Global error handler in server.js
        │
        ▼
res.status(statusCode).json({ status, data: { message } })
```

### Key Utilities

#### `utils/appError.js`
Custom error class that extends the native `Error`:

```js
new AppError("task not found", 404, "fail")
// → error.message   = "task not found"
// → error.statusCode = 404
// → error.status     = "fail"
```

#### `middlewares/asyncwrapper.middleware.js`
Higher-order function that wraps every async route handler. Any unhandled promise rejection is automatically forwarded to the global error handler — no need for `try/catch` in controllers:

```js
const getTasks = asyncWrapper(async (req, res) => {
  // any thrown error is caught and passed to next()
});
```

#### Global Handlers in `server.js`
- **404 handler** — catches requests to undefined routes
- **Error handler** — catches all errors forwarded via `next(err)` and returns a uniform JSend error response

---

## Notes

- **Persistent Storage**: Tasks are stored in MongoDB using Mongoose. Data persists across server restarts.
- **Task IDs**: Each task has a unique identifier generated using `crypto.randomUUID()` instead of MongoDB's default `_id`.
- **Service Layer Architecture**: Controllers handle HTTP concerns while services contain all business logic and database operations.
- **Async Error Handling**: All controllers are wrapped with `asyncWrapper` — no `try/catch` blocks needed. Errors propagate automatically to the global error handler.
- **Pagination**: `GET /tasksApi/` supports `?limit=N&page=N` query parameters. Default is 2 tasks per page.
- **Field Projection**: MongoDB internal fields (`_id`, `__v`) are excluded from all responses via `.select("-__v -_id")`.
- **CORS**: Cross-origin requests are enabled globally via the `cors` middleware.
- **Port Configuration**: Port is configurable via the `PORT` variable in `.env`.
- **Database Connection**: MongoDB connection is established in `server.js` on server startup with automatic error handling and process exit on failure.
- **Password Hashing**: User passwords are hashed with `bcryptjs` (10 salt rounds) before being stored; plaintext passwords are never persisted or returned in responses.
- **JWT Authentication**: `POST /usersApi/register` and `POST /usersApi/signin` return a signed JWT and are the only public routes. Every other route requires it via `Authorization: Bearer <token>` — see [Authentication](#authentication).
- **Role-Based Access**: Users have a `role` (`"admin"` or `"user"`, default `"user"`). `DELETE /tasksApi/:task_id` additionally requires the caller's role to be `"admin"`.
