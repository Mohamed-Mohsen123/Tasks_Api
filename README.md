# Tasks API

A RESTful API built with **Node.js** and **Express** for managing tasks. Supports creating, reading, updating, and deleting tasks with input validation middleware and a dedicated service layer. Uses **MongoDB** with **Mongoose** ODM for persistent data storage and **crypto UUID** for unique task identifiers. All responses follow the **JSend** format and errors are handled centrally via a global error handler.

---

## Project Structure

```
tasks-api/
├── controllers/
│   └── tasks.controller.js       # Request handlers (delegates to services)
├── middlewares/
│   ├── asyncwrapper.middleware.js # Wraps async handlers, forwards errors to next()
│   └── tasks.middlwares.js        # Validation schemas & error handling
├── model/
│   └── tasks.model.js             # Mongoose schema & model definition
├── routes/
│   └── tasks.routes.js            # Route definitions
├── services/
│   └── tasks.services.js          # Business logic & database operations
├── utils/
│   ├── appError.js                # Custom AppError class
│   └── httpStatusText.js          # JSend status constants (SUCCESS, FAIL, ERROR)
├── server.js                      # App entry point, MongoDB connection & global handlers
├── .env                           # Environment variables (PORT, MONGO_URI)
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

| Package             | Version  | Purpose                         |
| ------------------- | -------- | ------------------------------- |
| `express`           | ^5.2.1   | HTTP server & routing           |
| `express-validator` | ^7.3.2   | Request validation              |
| `mongoose`          | ^8.x.x   | MongoDB ODM & schema validation |
| `mongodb`           | ^6.x.x   | MongoDB driver                  |
| `cors`              | ^2.x.x   | Cross-origin resource sharing   |
| `dotenv`            | ^17.4.2  | Environment variable loading    |
| `crypto`            | Built-in | UUID generation for task IDs    |

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

### Delete a Task

```
DELETE /tasksApi/:task_id
```

**Response** `200 OK`

```json
{
  "status": "sucsses",
  "data": null
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
