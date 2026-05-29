# Tasks API

A RESTful API built with **Node.js** and **Express** for managing tasks. Supports creating, reading, updating, and deleting tasks with input validation middleware and a dedicated service layer. Now includes a **MongoDB Atlas** connection for future persistence.

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
├── server.js                 # App entry point
├── .env                      # Environment variables (PORT)
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
```

### Running the Server

```bash
node server.js
```

The server starts on the port defined in `.env` (default **3000**).

```
Connected successfully to server
Server running on port 3000
```

---

## Tech Stack

| Package             | Version  | Purpose                        |
| ------------------- | -------- | ------------------------------ |
| `express`           | ^5.2.1   | HTTP server & routing          |
| `express-validator` | ^7.3.2   | Request validation             |
| `mongodb`           | ^7.2.0   | MongoDB Atlas driver           |
| `dotenv`            | ^17.4.2  | Environment variable loading   |

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

| Endpoint                    | Field                | Rules                      |
| --------------------------- | -------------------- | -------------------------- |
| `POST /`                    | `title` (body)       | Required, min 3 characters |
| `GET /:task_id`             | `task_id` (param)    | Valid UUID                 |
| `GET /title/:task_title`    | `task_title` (param) | Required                   |
| `PATCH /:task_id`           | `task_id` (param)    | Valid UUID                 |
|                             | `title` (body)       | Required, min 3 characters |
| `PUT /:task_id`             | `task_id` (param)    | Valid UUID                 |
|                             | `title` (body)       | Required, min 3 characters |
| `DELETE /:task_id`          | `task_id` (param)    | Valid UUID                 |

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

- Tasks are currently stored **in-memory** — data resets when the server restarts. The MongoDB Atlas connection is in place in `server.js`; replace the in-memory data store in `services/tasks.services.js` with DB calls to enable full persistence.
- Task IDs are generated using `crypto.randomUUID()`.
- The API follows a **Service Layer** pattern — controllers handle HTTP concerns while services contain all business logic.
- Port is configurable via the `PORT` variable in `.env`.
