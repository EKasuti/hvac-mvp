import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MaintenanceType } from "@/lib/types";

export function AddLogForm() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        building_name: "",
        maintenance_type: "PREVENTIVE" as MaintenanceType,
        energy_draw_kw: "",
    });

    const mutation = useMutation({
        mutationFn: async (newLog: typeof formData) => {
            return axios.post(`${import.meta.env.VITE_API_URL}/logs`, {
                ...newLog,
                energy_draw_kw: parseFloat(newLog.energy_draw_kw)
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs'] });
            queryClient.invalidateQueries({ queryKey: ['roi'] });
            setFormData({
                building_name: "",
                maintenance_type: "PREVENTIVE",
                energy_draw_kw: "",
            });
        },
        onError: (error) => {
            console.error("Failed to add log:", error);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.building_name || !formData.energy_draw_kw) return;
        mutation.mutate(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Log</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="building">Building Name</Label>
                        <Input
                            id="building"
                            placeholder="e.g. Building A"
                            value={formData.building_name}
                            onChange={(e) => setFormData({ ...formData, building_name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.maintenance_type}
                            onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value as MaintenanceType })}
                        >
                            <option value="PREVENTIVE">PREVENTIVE</option>
                            <option value="CORRECTIVE">CORRECTIVE</option>
                            <option value="EMERGENCY">EMERGENCY</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="energy">Energy Draw (kW)</Label>
                        <Input
                            id="energy"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.energy_draw_kw}
                            onChange={(e) => setFormData({ ...formData, energy_draw_kw: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? "Submitting..." : "Submit Log"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
