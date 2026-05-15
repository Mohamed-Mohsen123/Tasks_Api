# Tasks API

A simple Express.js REST API for managing tasks.

## Installation

1. Make sure you have Node.js installed
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the server:

```bash
node script.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Get All Tasks

- **Endpoint:** `GET /tasksApi/`
- **Description:** Retrieve all tasks
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Clean the house"
    },
    {
      "id": 2,
      "title": "Call your aunt"
    }
  ]
  ```

### 2. Create a New Task

- **Endpoint:** `POST /tasksApi/`
- **Description:** Add a new task
- **Request Body:**
  ```json
  {
    "title": "Buy groceries"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "msg": "task added successfully!"
  }
  ```
- **Error Response (400):** If title already exists
  ```json
  {
    "err": "duplicated title"
  }
  ```

### 3. Delete a Task

- **Endpoint:** `DELETE /tasksApi/:task_id`
- **Description:** Delete a task by ID
- **Parameters:**
  - `task_id` (required): The ID of the task to delete
- **Success Response (200):**
  ```json
  {
    "msg": "task deleted successfully!"
  }
  ```
- **Error Response (400):** If task not found
  ```json
  {
    "err": "task not found (wrong id number)"
  }
  ```

### 4. Update a Task

- **Endpoint:** `PATCH /tasksApi/:task_id`
- **Description:** Update a task's title by ID
- **Parameters:**
  - `task_id` (required): The ID of the task to update
- **Request Body:**
  ```json
  {
    "title": "New task title"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "msg": "task updated successfully!"
  }
  ```
- **Error Response (400):** If task not found
  ```json
  {
    "err": "task not found (wrong id number)"
  }
  ```

## Example Usage

```bash
# Get all tasks
curl http://localhost:3000/tasksApi/

# Add a new task
curl -X POST http://localhost:3000/tasksApi/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js"}'

# Update a task (ID: 1)
curl -X PATCH http://localhost:3000/tasksApi/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express.js"}'

# Delete a task (ID: 1)
curl -X DELETE http://localhost:3000/tasksApi/1
```

## Default Tasks

The API comes with three default tasks:

1. Clean the house
2. Call your aunt
3. Make the bed

## Notes

- Tasks are stored in memory and will be reset when the server restarts
- Task IDs are automatically generated based on the highest existing ID
- Duplicate task titles are not allowed
