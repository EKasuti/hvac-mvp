package handler

import (
	"time"

	"hvac-mvp/server/internal/db"
	"hvac-mvp/server/internal/models"

	"github.com/gofiber/fiber/v2"
	"github.com/shopspring/decimal"
)

// GetROI returns the total money saved.
// GET /api/roi
func GetROI(c *fiber.Ctx) error {
	rate := decimal.NewFromFloat(0.18) // I had hardcoded this value 

	var logs []models.MaintenanceLog
	if result := db.DB.Find(&logs); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch maintenance logs",
		})
	}

	totalEnergyDraw := decimal.Zero

	for _, l := range logs {
		totalEnergyDraw = totalEnergyDraw.Add(l.EnergyDrawKW)
	}

	totalSaved := totalEnergyDraw.Mul(rate)

	return c.JSON(fiber.Map{
		"total_energy_units": totalEnergyDraw,
		"rate_per_unit":      rate,
		"total_money_saved":  totalSaved,
		"currency":           "USD",
	})
}

// GetLogs returns all maintenance logs
// GET /api/logs
func GetLogs(c *fiber.Ctx) error {
	var logs []models.MaintenanceLog
	if result := db.DB.Order("timestamp desc").Find(&logs); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch logs",
		})
	}
	return c.JSON(logs)
}

// CreateLog adds a new maintenance log
// POST /api/logs
func CreateLog(c *fiber.Ctx) error {
	log := new(models.MaintenanceLog)
	if err := c.BodyParser(log); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	// Ensure building exists
	var building models.Building
	if result := db.DB.First(&building, "name = ?", log.BuildingName); result.Error != nil {
		// Create building if not exists
		building = models.Building{Name: log.BuildingName}
		if result := db.DB.Create(&building); result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create building",
			})
		}
	}

	// Set timestamp if empty
	if log.Timestamp.IsZero() {
		log.Timestamp = time.Now()
	}

	if result := db.DB.Create(&log); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create log",
		})
	}

	return c.JSON(log)
}

// DeleteLog removes a maintenance log
// DELETE /api/logs/:id
func DeleteLog(c *fiber.Ctx) error {
	id := c.Params("id")
	if result := db.DB.Delete(&models.MaintenanceLog{}, id); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete log",
		})
	}
	return c.SendStatus(fiber.StatusOK)
}

// UpdateLog modifies an existing maintenance log
// PUT /api/logs/:id
func UpdateLog(c *fiber.Ctx) error {
	id := c.Params("id")
	type UpdateDTO struct {
		BuildingName    string                 `json:"building_name"`
		MaintenanceType models.MaintenanceType `json:"maintenance_type"`
		EnergyDrawKW    decimal.Decimal        `json:"energy_draw_kw"`
	}
	dto := new(UpdateDTO)

	if err := c.BodyParser(dto); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	var log models.MaintenanceLog
	if result := db.DB.First(&log, id); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Log not found",
		})
	}

	// Update fields
	log.BuildingName = dto.BuildingName
	log.MaintenanceType = dto.MaintenanceType
	log.EnergyDrawKW = dto.EnergyDrawKW

	// Ensure building exists
	var building models.Building
	if result := db.DB.First(&building, "name = ?", log.BuildingName); result.Error != nil {
		building = models.Building{Name: log.BuildingName}
		db.DB.Create(&building)
	}

	db.DB.Save(&log)
	return c.JSON(log)
}
