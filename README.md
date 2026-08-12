# CivicLens

CivicLens is a web-based civic issue reporting application that allows users to register, log in, submit civic complaints/reports, and manage their reported issues through a centralized platform.

The application follows a client-server architecture with a React frontend, Node.js/Express backend, and MongoDB Atlas database. The complete application has also been containerized using Docker and Docker Compose.

---

## Features

- User registration and login
- Secure password handling using bcrypt
- JWT-based authentication
- Civic issue/report submission
- Report management
- Image/file upload support through Cloudinary
- REST API-based backend
- MongoDB Atlas database integration
- Responsive React-based frontend
- Dockerized frontend and backend
- Docker Compose for running the complete application

---

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- CORS
- dotenv

### DevOps / Containerization
- Docker
- Docker Compose
- Nginx
- Docker Desktop

### Database
- MongoDB Atlas

---

## Project Structure

```text
CivicLens/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── ...
│
├── Dockerfile
├── client/Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
├── .env
└── README.md