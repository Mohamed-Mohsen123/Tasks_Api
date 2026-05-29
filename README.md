# Tasks API

A RESTful API built with **Node.js** and **Express** for managing tasks. Supports creating, reading, updating, and deleting tasks with input validation middleware and a dedicated service layer. Uses **MongoDB** with **Mongoose** ODM for persistent data storage and **crypto UUID** for unique task identifiers.

---

## Project Structure

```
tasks-api/
├── controllers/
│   └── tasks.controller.js   # Request handlers (delegates to services)
├── model/
│   └── tasks.model.js        # Mongoose schema & model definition
├── middlewares/
│   └── tasks.middlwares.js   # Validation schemas & error handling
├── routes/
│   └── tasks.routes.js       # Route definitions
├── services/
│   └── tasks.services.js     # Business logic & database operations
├── server.js                 # App entry point & MongoDB connection
├── .env                      # Environment variables (PORT, MONGO_URI)
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
| `dotenv`            | ^17.4.2  | Environment variable loading    |
| `crypto`            | Built-in | UUID generation for task IDs    |

---

## API Reference

All endpoints are prefixed with `/tasksApi`.

### Get All Tasks

```
GET /tasksApi/
```

**Response** `200 OK`

```json
[
  { "id": "uuid", "title": "Buy groceries" },
  { "id": "uuid", "title": "Write report" }
]
```

---

### Get a Task by ID

```
GET /tasksApi/:task_id
```

**Response** `200 OK`

```json
{ "id": "uuid", "title": "Buy groceries" }
```

**Error** `404 Not Found` — if the task ID is not found

```json
{ "err": "task not found (wrong id number)" }
```

---

### Get a Task by Title

```
GET /tasksApi/title/:task_title
```

**Response** `200 OK`

```json
{ "id": "uuid", "title": "Buy groceries" }
```

**Error** `404 Not Found` — if the title is not found

```json
{ "err": "task not found (wrong title)" }
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

**Response** `200 OK`

```json
{ "msg": "task added successfully!" }
```

**Error** `409 Conflict` — if the title already exists

```json
{ "err": "duplicated title" }
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
{ "msg": "task updated successfully!" }
```

**Error** `404 Not Found` — if the task ID is not found

```json
{ "err": "task not found (wrong id number)" }
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
{ "msg": "task replaced successfully!" }
```

**Error** `404 Not Found` — if the task ID is not found

```json
{ "err": "task not found (wrong id number)" }
```

---

### Delete a Task

```
DELETE /tasksApi/:task_id
```

**Response** `200 OK`

```json
{ "msg": "task deleted successfully!" }
```

**Error** `404 Not Found` — if the task ID is not found

```json
{ "err": "task not found (wrong id number)" }
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

## Notes

- **Persistent Storage**: Tasks are stored in MongoDB using Mongoose. Data persists across server restarts.
- **Task IDs**: Each task has a unique identifier generated using `crypto.randomUUID()` instead of MongoDB's default `_id`.
- **Service Layer Architecture**: Controllers handle HTTP concerns while services contain all business logic and database operations.
- **Async Operations**: All service functions are async and return database queries with proper error handling.
- **Port Configuration**: Port is configurable via the `PORT` variable in `.env`.
- **Database Connection**: MongoDB connection is established in `server.js` on server startup with automatic error handling.
