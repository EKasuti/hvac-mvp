import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MaintenanceLog, MaintenanceType } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function MaintenanceFeed() {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<MaintenanceLog>>({});

    const { data: logs = [] } = useQuery({
        queryKey: ['logs'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/logs`);
            return res.data as MaintenanceLog[];
        },
        refetchInterval: editingId ? undefined : 5000,
    });

    const updateMutation = useMutation({
        mutationFn: async (updatedLog: { id: number; data: Partial<MaintenanceLog> }) => {
            return axios.put(`${import.meta.env.VITE_API_URL}/logs/${updatedLog.id}`, {
                building_name: updatedLog.data.building_name,
                maintenance_type: updatedLog.data.maintenance_type,
                energy_draw_kw: parseFloat(updatedLog.data.energy_draw_kw as unknown as string)
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs'] });
            queryClient.invalidateQueries({ queryKey: ['roi'] });
            setEditingId(null);
            setEditForm({});
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return axios.delete(`${import.meta.env.VITE_API_URL}/logs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['logs'] });
            queryClient.invalidateQueries({ queryKey: ['roi'] });
        }
    });

    const startEdit = (log: MaintenanceLog) => {
        setEditingId(log.id);
        setEditForm(log);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = () => {
        if (!editingId || !editForm) return;
        updateMutation.mutate({ id: editingId, data: editForm });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure?')) return;
        deleteMutation.mutate(id);
    };

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Maintenance Feed</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Building</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Values (kW)</TableHead>
                                <TableHead className="text-right">Timestamp / Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        {editingId === log.id ? (
                                            <>
                                                <TableCell>
                                                    <Input
                                                        value={editForm.building_name}
                                                        onChange={e => setEditForm({ ...editForm, building_name: e.target.value })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <select
                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={editForm.maintenance_type}
                                                        onChange={(e) => setEditForm({ ...editForm, maintenance_type: e.target.value as MaintenanceType })}
                                                    >
                                                        <option value="PREVENTIVE">PREVENTIVE</option>
                                                        <option value="CORRECTIVE">CORRECTIVE</option>
                                                        <option value="EMERGENCY">EMERGENCY</option>
                                                    </select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={editForm.energy_draw_kw}
                                                        onChange={e => setEditForm({ ...editForm, energy_draw_kw: e.target.value })}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 mr-2">✓</button>
                                                    <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">✕</button>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell className="font-medium">{log.building_name}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                ${log.maintenance_type === 'PREVENTIVE' ? 'bg-blue-100 text-blue-800' :
                                                            log.maintenance_type === 'CORRECTIVE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                        {log.maintenance_type}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{log.energy_draw_kw}</TableCell>
                                                <TableCell className="text-right flex items-center justify-end gap-2">
                                                    <span>
                                                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                                                            month: 'numeric',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                        {", "}
                                                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            second: 'numeric',
                                                            hour12: true
                                                        })}
                                                    </span>
                                                    <button
                                                        onClick={() => startEdit(log)}
                                                        className="text-blue-500 hover:text-blue-700 ml-2"
                                                        title="Edit"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                        title="Delete"
                                                    >
                                                        ✕
                                                    </button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
