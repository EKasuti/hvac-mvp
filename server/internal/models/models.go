package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type MaintenanceType string

const (
	MaintenanceTypePreventive MaintenanceType = "PREVENTIVE"
	MaintenanceTypeCorrective MaintenanceType = "CORRECTIVE"
	MaintenanceTypeEmergency  MaintenanceType = "EMERGENCY"
)

type Building struct {
	Name string `gorm:"primaryKey" json:"name"`
}

type MaintenanceLog struct {
	ID              uint            `gorm:"primaryKey" json:"id"`
	BuildingName    string          `json:"building_name"`
	Building        Building        `gorm:"foreignKey:BuildingName" json:"-"`
	MaintenanceType MaintenanceType `gorm:"type:text" json:"maintenance_type"`
	EnergyDrawKW    decimal.Decimal `gorm:"type:decimal(10,2)" json:"energy_draw_kw"`
	Timestamp       time.Time       `json:"timestamp"`
}
