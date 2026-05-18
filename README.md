# Tasks API

A RESTful API built with **Node.js** and **Express** for managing tasks. Supports creating, reading, updating, and deleting tasks with input validation middleware and a dedicated service layer.

---

## Project Structure

```
tasks-api/
├── controllers/
│   └── tasks.controller.js   # Request handlers (delegates to services)
├── data/
│   └── tasks.js              # In-memory task data store
├── middlewares/
│   └── tasks.middlwares.js   # Validation schemas & error handling
├── routes/
│   └── tasks.routes.js       # Route definitions
├── services/
│   └── tasks.services.js     # Business logic & data operations
├── script.js                 # App entry point
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm

### Installation

```bash
git clone <your-repo-url>
cd tasks-api
npm install
```

### Running the Server

```bash
node server.js
```

The server starts on **port 3000** by default.

```
Server running on port {port number}!
```

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

**Error** `400 Bad Request` — if the task ID is not found

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

**Error** `400 Bad Request` — if the title is not found

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

**Error** `400 Bad Request` — if the title already exists

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

**Error** `400 Bad Request` — if the task ID is not found

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

**Error** `400 Bad Request` — if the task ID is not found

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

**Error** `400 Bad Request` — if the task ID is not found

```json
{ "err": "task not found (wrong id number)" }
```

---

## Validation Rules

Powered by [`express-validator`](https://express-validator.github.io/). Validation runs before any controller logic via `handleValidationErrors` middleware.

| Endpoint                    | Field              | Rules                      |
| --------------------------- | ------------------ | -------------------------- |
| `POST /`                    | `title` (body)     | Required, min 3 characters |
| `GET /:task_id`             | `task_id` (param)  | Valid UUID                 |
| `GET /title/:task_title`    | `task_title` (param) | Required                 |
| `PATCH /:task_id`           | `task_id` (param)  | Valid UUID                 |
|                             | `title` (body)     | Required, min 3 characters |
| `PUT /:task_id`             | `task_id` (param)  | Valid UUID                 |
|                             | `title` (body)     | Required, min 3 characters |
| `DELETE /:task_id`          | `task_id` (param)  | Valid UUID                 |

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

- Tasks are stored **in-memory** — data resets when the server restarts. To persist data, replace `data/tasks.js` with a database integration.
- Task IDs are generated using `crypto.randomUUID()`.
- The API follows a **Service Layer** pattern — controllers handle HTTP concerns while services contain all business logic.
