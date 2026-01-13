-include ../.env

.PHONY: dev build run

# Run locally with Docker DB
dev:
	ALLOW_ORIGINS="$(ALLOW_ORIGINS)" DATABASE_URL="host=localhost user=$(POSTGRES_USER) password=$(POSTGRES_PASSWORD) dbname=$(POSTGRES_DB) port=$(DB_PORT) sslmode=disable" go run cmd/main.go

# Run locally but connect to Prod DB
dev-prod:
	ALLOW_ORIGINS="$(ALLOW_ORIGINS)" DATABASE_URL="$(DATABASE_URL)" go run cmd/main.go

build:
	go build -o bin/server cmd/main.go

run:
	./bin/server
