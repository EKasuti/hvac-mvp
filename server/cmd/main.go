package main

import (
	"log"
	"os"
	"time"

	"hvac-mvp/server/internal/db"
	"hvac-mvp/server/internal/handler"
	"hvac-mvp/server/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/shopspring/decimal"
)

func main() {
	// Initialize Fiber app
	app := fiber.New()
	app.Use(logger.New())
	// Configure CORS
	allowOrigins := os.Getenv("ALLOW_ORIGINS")
	if allowOrigins == "" {
		allowOrigins = "*"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins: allowOrigins,
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Connect to Database
	if err := db.Connect(); err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}

	// Auto Migrate
	log.Println("Running migrations...")
	if err := db.DB.AutoMigrate(&models.Building{}, &models.MaintenanceLog{}); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Seed Data if empty
	var count int64
	db.DB.Model(&models.MaintenanceLog{}).Count(&count)
	if count == 0 {
		log.Println("Seeding database...")
		buildings := []models.Building{
			{Name: "Building A"},
			{Name: "Building B"},
		}
		db.DB.Create(&buildings)

		now := time.Now()
		logs := []models.MaintenanceLog{
			{BuildingName: "Building A", MaintenanceType: models.MaintenanceTypePreventive, EnergyDrawKW: decimal.NewFromFloat(100.50), Timestamp: now},
			{BuildingName: "Building B", MaintenanceType: models.MaintenanceTypeCorrective, EnergyDrawKW: decimal.NewFromFloat(250.00), Timestamp: now.Add(-24 * time.Hour)}, // Yesterday
			{BuildingName: "Building A", MaintenanceType: models.MaintenanceTypeEmergency, EnergyDrawKW: decimal.NewFromFloat(50.00), Timestamp: now.Add(-48 * time.Hour)},   // 2 days ago
		}
		db.DB.Create(&logs)
		log.Println("Database seeded.")
	}

	// Setup Routes
	api := app.Group("/api")
	api.Get("/roi", handler.GetROI)
	api.Get("/logs", handler.GetLogs)
	api.Post("/logs", handler.CreateLog)
	api.Delete("/logs/:id", handler.DeleteLog)
	api.Put("/logs/:id", handler.UpdateLog)

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
