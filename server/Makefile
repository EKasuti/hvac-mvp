-include ../.env

.PHONY: dev build run

dev:
	ALLOW_ORIGINS="$(ALLOW_ORIGINS)" DATABASE_URL="host=localhost user=$(POSTGRES_USER) password=$(POSTGRES_PASSWORD) dbname=$(POSTGRES_DB) port=$(DB_PORT) sslmode=disable" go run cmd/main.go

build:
	go build -o bin/server cmd/main.go

run:
	./bin/server
