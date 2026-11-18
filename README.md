# COMP3123 Assignment 2 - MERN Employee Management System

**Student ID:** 101507439

## 1. Project Overview

This project is a full-stack Employee Management System developed for COMP3123 Assignment 2.

Users can register, log in, manage their employees, search employee records, and upload employee profile pictures. Each user can access only their own employee records.

### Technologies

- Frontend: React 19, Vite, React Router, Axios, CSS
- Backend: Node.js 24, Express.js, Mongoose
- Database: MongoDB
- Authentication: JWT and bcryptjs
- Security: Helmet, CORS, Express Validator, rate limiting
- File uploads: Multer and Sharp
- Deployment: Docker, Docker Compose, Nginx
- Database interface: Mongo Express
- API testing: Postman and Newman

## 2. Features

- User registration and login
- JWT authentication
- Protected frontend routes
- Employee creation, viewing, updating, and deletion
- Search by department and position
- Employee profile picture upload
- Input validation and user-friendly error handling
- Employee ownership and access control
- Responsive React interface
- Persistent MongoDB data and uploaded pictures

## 3. Architecture

The React frontend communicates with the Express REST API using Axios.

The Express backend connects to MongoDB through Mongoose.

The frontend sends a JWT in the Authorization header when accessing protected endpoints.

```text
React Frontend (Vite / Nginx)
         |
         | HTTP requests using Axios
         | Authorization: Bearer JWT
         v
Node.js / Express REST API
         |
         | Mongoose
         v
MongoDB Database
```

Docker Compose manages four services:

1. mongo
2. mongo-express
3. backend
4. frontend

### Project Structure

```text
101507439_comp3123_assignment2_reactjs/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── postman/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── index.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── .env.example
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 4. Installation and Running

### Requirements

- Git
- Docker Desktop with Docker Compose

Node.js and npm are required only when running without Docker.

### Clone the Repository

```bash
git clone https://github.com/mii1na/101507439_comp3123_assignment2_reactjs.git
cd 101507439_comp3123_assignment2_reactjs
```

### Configure Docker Environment Variables

Copy the root environment example:

```bash
cp .env.example .env
```

Open the root `.env` file and replace the placeholder values for `JWT_SECRET` and `ME_CONFIG_BASICAUTH_PASSWORD` with secure private values.

Do not commit `.env` to GitHub.

### Start with Docker Compose

```bash
docker compose up --build
```

This builds and starts the application, MongoDB, and Mongo Express.

### Application URLs

| Service | URL |
|---|---|
| React application | http://localhost:5173 |
| Express API | http://localhost:5001 |
| Backend health check | http://localhost:5001/health |
| Mongo Express | http://localhost:8081 |

Mongo Express requires the username and password configured in the root `.env` file.

### Run in Detached Mode

```bash
docker compose up -d
```

### Check Containers

```bash
docker compose ps
```

### Stop Containers

```bash
docker compose down
```

### Data Persistence

Docker Compose creates two named volumes:

- `mongo_data` stores MongoDB data.
- `employee_uploads` stores uploaded profile pictures.

Data remains available after stopping and restarting containers.

Do not use `docker compose down -v` unless you intend to delete the stored volumes.

## 5. Running Locally Without Docker

Start a local MongoDB server on port 27017.

### Backend

```bash
cd backend
cp .env.example .env
npm ci
npm start
```

Replace `JWT_SECRET` in `backend/.env` with a secure value.

The backend runs on port 5001.

### Frontend

Open another terminal:

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

The React development server runs on port 5173.

Do not start the local backend and Docker backend simultaneously on the same port.

## 6. Environment Variables

### Root `.env` for Docker Compose

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string using Docker service name `mongo` |
| `JWT_SECRET` | Private key used for signing and verifying JWT tokens |
| `PORT` | Express server port, normally 5001 |
| `CORS_ORIGIN` | Allowed frontend origin |
| `VITE_API_BASE_URL` | API base URL used during frontend build |
| `ME_CONFIG_BASICAUTH_USERNAME` | Mongo Express login username |
| `ME_CONFIG_BASICAUTH_PASSWORD` | Mongo Express login password |

For Docker Compose, MongoDB is accessed using:

`mongodb://mongo:27017/comp3123_assignment2`

### Backend Environment

- `PORT`: Express server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `CORS_ORIGIN`: Allowed React frontend origin
- `NODE_ENV`: Environment mode, set to `production` by Docker Compose
- `VERCEL`: Optional deployment flag used for Vercel execution

### Frontend Environment

- `VITE_API_BASE_URL`: Backend API address, normally `http://localhost:5001/api/v1`

All real secrets are stored outside the committed source files.

## 7. API Documentation

Base URL:

`http://localhost:5001`

### User Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/user/signup` | Register a user |
| POST | `/api/v1/user/login` | Authenticate and receive a JWT |

Signup accepts:

- `username`
- `email`
- `password`

Login accepts a username or email together with a password.

### Employee Endpoints

All employee endpoints require:

`Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/emp/employees` | Get current user's employees |
| GET | `/api/v1/emp/employees/search` | Search current user's employees |
| POST | `/api/v1/emp/employees` | Create employee |
| GET | `/api/v1/emp/employees/:eid` | Get employee by ID |
| PUT | `/api/v1/emp/employees/:eid` | Update employee |
| DELETE | `/api/v1/emp/employees?eid=ID` | Delete employee |

### Employee Fields

- `first_name`
- `last_name`
- `email`
- `position`
- `salary`
- `date_of_joining`
- `department`
- `profile_picture` (optional)

### Employee Search

Search using the `department` and `position` query parameters.

Example:

`GET /api/v1/emp/employees/search?department=IT&position=Developer`

Search supports case-insensitive partial matching.

Search results are restricted to employees belonging to the authenticated user.

### Profile Picture Upload

Profile pictures can be submitted when creating or updating an employee.

- Request format: `multipart/form-data`
- File field: `profile_picture`
- Allowed formats: JPEG, PNG, WebP
- Maximum file size: 2 MB
- Files are validated and processed using Sharp.
- Uploaded pictures are converted to WebP.
- Pictures are served from `/uploads/`.
- Replaced and deleted employee pictures are cleaned up.

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/uploads/:filename` | Serve uploaded profile pictures |

## 8. Authentication and Authorization

Passwords are hashed using bcryptjs before storage.

After a successful login, the backend generates a JWT containing the user's ID.

Tokens expire after one hour.

The React frontend stores the JWT in browser localStorage.

Axios automatically sends the token in the Authorization header for protected API requests.

The backend verifies the JWT before allowing access to employee endpoints.

Employee records are associated with the authenticated user's ID.

The backend restricts employee listing and search to that user's records.

Direct access, updates, or deletion attempts involving another user's employee are denied.

An expired or invalid JWT results in HTTP 401. The frontend clears the token and redirects to the login page.

## 9. Frontend Documentation

### Routes

| Route | Page |
|---|---|
| `/login` | Login |
| `/signup` | Registration |
| `/employees` | Employee list and search |
| `/employees/add` | Add employee |
| `/employees/:id` | Employee details |
| `/employees/:id/edit` | Edit employee |
| Other paths | Not Found page |

The application uses React Router for navigation.

### Main Components

- `Navbar`: Main application navigation
- `ProtectedRoute`: Restricts authenticated pages
- `PublicRoute`: Handles public authentication pages
- `AuthProvider`: Manages login, logout, and authentication state

### API Integration

`src/api/axios.js` creates the shared Axios instance.

The Axios request interceptor attaches the stored JWT to API requests.

The response interceptor handles unauthorized protected requests.

User and employee API functions are organized in separate modules.

### Error Handling

The frontend is designed to display user-friendly messages for:

- Invalid login credentials (401)
- Existing users (409)
- Invalid form fields (400)
- Expired or invalid sessions (401)
- Unauthorized or missing employees (403 and 404)
- Excessive requests (429)
- Network failures
- Invalid profile picture types
- Oversized profile pictures

## 10. Security

Security features include:

- bcryptjs password hashing
- JWT authentication
- JWT expiration and verification
- Employee ownership enforcement
- Helmet HTTP security headers
- CORS origin restrictions
- Express Validator input validation
- Authentication rate limiting
- Multer file upload restrictions
- Sharp image content validation
- Private environment variables
- Git ignore rules for secrets and uploaded files

The authentication endpoints are limited to 10 requests per 15 minutes during normal operation.

MongoDB is not exposed directly to the host by the Docker Compose configuration.

The locally exposed HTTP services are bound to `127.0.0.1`.

## 11. Logging and Health Check

The backend uses Morgan and application event logging.

### Logging

For local development, logs are written to:

- `backend/logs/app.log`
- `backend/logs/error.log`

When running in production mode, logs are written to standard output and standard error and can be viewed with Docker Compose.

The request logger records:

- Timestamp
- HTTP method
- Request path
- HTTP status code
- Response time

Request bodies, authorization headers, passwords, tokens, and URL query parameters are not included in request logs.

### Health Check

Endpoint:

`GET http://localhost:5001/health`

Expected response:

```json
{
  "status": "success",
  "message": "API is running"
}
```

Docker Compose uses the backend health endpoint to monitor service availability.

## 12. Testing

### Backend API Testing

Postman is used to test backend endpoints.

The updated Postman collection and supporting test resources are available in `backend/postman/`.

Import the collection into Postman, configure the backend URL and authentication variables, and run the requests.

Newman can also run exported Postman collections from the command line.

### Backend Test Coverage

API testing covers:

- Signup and login
- Duplicate user registration
- Invalid credentials
- JWT authentication
- Employee CRUD
- Employee search
- Employee ownership
- Invalid requests
- Missing employees
- Profile picture uploads
- Invalid file uploads
- Rate limiting

### Frontend Testing

The React UI should be checked for:

- Successful signup and login
- Employee creation, viewing, editing, and deletion
- Employee search
- Successful and failed profile picture uploads
- Error messages for invalid requests
- Protected route redirects
- Invalid and expired token handling
- Rate limiting messages

### Two-User Security Scenario

The required test uses User A and User B.

Each user creates their own employee records.

The verification checks that:

1. User A sees only User A's employees.
2. User A's search returns only User A's employees.
3. User A cannot view, edit, or delete User B's employee.
4. The same restrictions apply when testing as User B.

These scenarios must be verified through the React UI.

## 13. Known Limitations

- This assignment uses local Docker Compose deployment rather than cloud deployment.
- The MongoDB service is configured for an isolated local demonstration and does not enable database authentication.
- The backend does not currently include a configured `npm test` unit test suite. API testing uses Postman and Newman.
- The frontend stores JWT tokens in localStorage.
- Docker Compose uses separate named volumes from any previously created standalone MongoDB containers.

## 14. GitHub Repository

https://github.com/mii1na/101507439_comp3123_assignment2_reactjs

The repository contains the frontend, backend, Docker files, environment examples, and Postman test resources.

Private `.env` files, `node_modules`, and uploaded user pictures are excluded from Git.

## Sample Test Credentials for Marking

The following account is for assignment testing only.

Username: assignment2_marker
Email: marker@example.com
Password: Comp3123Demo!2026

### Instructions for Markers

1. Start the application using Docker Compose.
2. Open http://localhost:5173.
3. Log in using the credentials above if the demo database is available.
4. For a fresh MongoDB database, register this account through the Signup page first.
5. Test employee CRUD, search, profile picture upload, and logout.

Note: This account is not automatically seeded into a fresh database.
The credentials are for assignment demonstration only.
