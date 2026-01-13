# HVAC MVP Backend

## Prerequisites

- Go 1.21+
- Docker & Docker Compose

## Getting Started

1. **Start the Database**
   ```bash
   docker-compose up -d
   ```

2. **Run the Server**
   ```bash
   go run cmd/main.go
   ```

3. **Check the API**
   - ROI Endpoint: [http://localhost:3000/api/roi](http://localhost:3000/api/roi)

## Configuration

- Port: 3000 (default)
- Database: Postgres on localhost:5433 (configured in docker-compose.yml)
