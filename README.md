# Tasks API

A simple RESTful API built with **Node.js** and **Express** for managing tasks. Supports creating, reading, updating, and deleting tasks with input validation middleware.

---

## Project Structure

```
tasks-api/
├── controllers/
│   └── tasks.controller.js   # Request handlers (CRUD logic)
├── data/
│   └── tasks.js              # In-memory task data store
├── middlewares/
│   └── tasks.middlwares.js   # Validation schemas & error handling
├── routes/
│   └── tasks.routes.js       # Route definitions
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
node script.js
```

The server starts on **port 3000** by default.

```
Example app listening on port 3000!
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
  { "id": 1, "title": "Buy groceries" },
  { "id": 2, "title": "Write report" }
]
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

### Update a Task

```
PATCH /tasksApi/:task_id
PUT /tasksApi/:task_id
```

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

| Endpoint           | Field             | Rules                      |
| ------------------ | ----------------- | -------------------------- |
| `POST /`           | `title` (body)    | Required, min 3 characters |
| `PATCH /:task_id`  | `task_id` (param) | Positive integer           |
| `PUT /:task_id`    | `task_id` (param) | Positive integer           |
|                    | `title` (body)    | Required, min 3 characters |
| `DELETE /:task_id` | `task_id` (param) | Positive integer           |

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
- Task IDs are auto-incremented based on the current maximum ID in the store.
