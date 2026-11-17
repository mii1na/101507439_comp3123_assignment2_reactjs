# COMP3123 Assignment 2 - MERN Employee Management System

Student ID: 101507439

## Technologies

- MongoDB
- Express.js
- React (Vite)
- Node.js
- Docker and Docker Compose
- Mongo Express
- Nginx

## Features

- User registration and login
- JWT authentication
- Employee CRUD operations
- Employee search
- Employee profile picture uploads
- Persistent MongoDB and uploaded images

## Run with Docker Compose

1. Copy `.env.example` to `.env`.
2. Replace the placeholder `JWT_SECRET` with a secure random value.
3. Replace the placeholder `ME_CONFIG_BASICAUTH_PASSWORD` with a private password.
4. Start the application:

    docker compose up --build

## Local Services

- React frontend: http://localhost:5173
- Backend health endpoint: http://localhost:5001/health
- Mongo Express: http://localhost:8081

Mongo Express uses the credentials configured in the root `.env` file.

## Stop the Application

    docker compose down

## Data Persistence

Docker Compose uses two named volumes:

- `mongo_data` for MongoDB
- `employee_uploads` for employee profile pictures

Data is preserved when the containers are stopped and recreated.

Do not use `docker compose down -v` unless you intentionally want to delete the stored data.

## Security

The `.env` file is excluded from Git. Only `.env.example` is included in the repository.

MongoDB is accessible only within the Docker Compose network. The application services are exposed on localhost for local testing.
