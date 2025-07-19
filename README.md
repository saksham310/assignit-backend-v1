# AssignIt Backend v1

This repository contains the backend for AssignIt, a project management tool developed as a Final Year Project. AssignIt helps teams streamline task assignment, project tracking, and collaboration.

> **Note:**  
> A new version (v2) of AssignIt is under active development using Django REST Framework (DRF).

---

## Features

- User authentication and role management
- Project and task creation
- Task assignment to users
- Progress tracking and status updates
- Real time Kanban Board and team collaboration tools

## Tech Stack

- **Backend Framework:** Node.js (Express)
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- PostgreSQL

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/saksham310/assignit-backend-v1.git
    cd assignit-backend-v1
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and update the configuration as needed (PostgreSQL credentials, secret keys, etc.).

4. **Run the backend server:**
    ```bash
    npm start
    ```
    or (for development with nodemon)
    ```bash
    npm run dev
    ```

## Usage

- The backend provides a RESTful API for project and task management.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.


---
