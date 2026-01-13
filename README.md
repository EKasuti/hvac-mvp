# BeaverLog

BeaverLog is a web-based dashboard application for monitoring HVAC maintenance logs and calculating energy savings. This project consists of a React frontend and a Go backend, utilizing a PostgreSQL database for data persistence.

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, TanStack Query
- **Backend:** Go (Golang), Fiber Http Framework, GORM
- **Database:** PostgreSQL
- **Infrastructure:** Docker, Docker Compose

## Installation and Setup

### Prerequisites

Ensure the following tools are installed on the development environment:
- Node.js (Version 18 or higher)
- Go (Version 1.21 or higher)
- Docker Desktop
- Make (Optional)

### Configuration

Create a file named `.env` in the root directory with the following configuration variables:

```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=beaverlog
DB_PORT=5433
SERVER_PORT=3000
ALLOW_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175
VITE_API_URL=http://localhost:3000/api
```

### Running the Application

#### Option 1: Docker Compose

To start the application using Docker Compose, execute the following command in the terminal:

```bash
docker-compose up -d --build
```

This will initialize the database, backend server, and frontend client containers.

- Frontend URL: http://localhost:5173
- Backend URL: http://localhost:3000

#### Option 2: Local Development

To run the services locally without Docker for the application logic:

1. Start the PostgreSQL database using Docker:
   ```bash
   docker-compose up -d db
   ```

2. Start both the client and server using the provided Makefile:
   ```bash
   make dev
   ```

Alternatively, start them individually in separate terminals:

**Server:**
```bash
cd server
go run cmd/main.go
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## Project Structure

The repository is organized into the following directories:

- `/client`: Contains the source code for the React frontend application.
- `/server`: Contains the source code for the Go backend API.
- `/server/internal`: Contains internal application packages such as handlers and database logic.
- `/server/cmd`: Contains the entry point for the backend application.

## API Endpoints

The backend provides the following RESTful API endpoints:

- `GET /api/logs`: Retrieve all maintenance logs.
- `POST /api/logs`: Create a new maintenance log.
- `PUT /api/logs/:id`: Update an existing maintenance log.
- `DELETE /api/logs/:id`: Delete a maintenance log.
- `GET /api/roi`: Retrieve return on investment calculations.

## License

This project is licensed under the MIT License.