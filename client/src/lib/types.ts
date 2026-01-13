export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY';

export interface MaintenanceLog {
    id: number;
    building_name: string;
    maintenance_type: MaintenanceType;
    energy_draw_kw: string; // Decimal comes as string from JSON often
    timestamp: string;
}

export interface ROIResponse {
    currency: string;
    rate_per_unit: string;
    total_energy_units: string;
    total_money_saved: string;
}
