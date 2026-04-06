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
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update the `.env` file with your configuration. See [Environment Variables](#environment-variables) section below for details.

4. **Set up the database:**
    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

5. **Run the backend server:**
    ```bash
    npm start
    ```
    or (for development with nodemon)
    ```bash
    npm run dev
    ```

## Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env` and configure the following:

### Server Configuration
- `PORT` - Server port (default: 8080)

### Database
- `DATABASE_URL` - PostgreSQL connection string
  ```
  DATABASE_URL=postgresql://username:password@localhost:5432/assignit
  ```

### Authentication
- `JWT_SECRET` - Secret key for JWT token generation (use a strong, random string in production)

### CORS Configuration
- `CORS_ORIGINS` - Comma-separated list of allowed origins for CORS
  ```
  CORS_ORIGINS=http://localhost:5173,https://yourapp.com,https://www.yourapp.com
  ```

### Email/SMTP Configuration
Configure these variables to send emails (password reset, notifications, etc.):

- `SMTP_HOST` - SMTP server hostname (e.g., `mail.gyanbazzar.com`, `smtp.gmail.com`)
- `SMTP_PORT` - SMTP server port (typically `587` for TLS or `465` for SSL)
- `SMTP_SECURE` - Set to `true` for port 465, `false` for other ports (auto-detected if not set)
- `SMTP_USERNAME` - SMTP authentication username
- `SMTP_PASSWORD` - SMTP authentication password
- `MAIL_FROM_ADDRESS` - Email address to send from (e.g., `no-reply@example.com`)
- `MAIL_FROM_NAME` - Display name for outgoing emails (default: `AssignIt`)

**Example SMTP configurations:**

For Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
```

For custom mail server:
```env
SMTP_HOST=mail.gyanbazzar.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=no-reply@gyanbazzar.com
SMTP_PASSWORD=your-password
MAIL_FROM_ADDRESS=no-reply@gyanbazzar.com
```

### Cloudinary (File Uploads)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

## Deployment

For production deployment:

1. Set all required environment variables on your hosting platform
2. Ensure `JWT_SECRET` is a strong, random string
3. Configure `CORS_ORIGINS` with your frontend domain(s)
4. Use a production-ready PostgreSQL database
5. Set up proper SMTP credentials for email functionality
6. Run database migrations: `npx prisma migrate deploy`

## Usage

- The backend provides a RESTful API for project and task management.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.


---
