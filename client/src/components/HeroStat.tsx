import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface HeroStatProps {
    amount: string;
}

export function HeroStat({ amount }: HeroStatProps) {
    // Format the amount as currency if it's a valid number
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(parseFloat(amount) || 0);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formattedAmount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Based on reduction in energy waste
                </p>
            </CardContent>
        </Card>
    );
}
