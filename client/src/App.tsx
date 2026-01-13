import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HeroStat } from "@/components/HeroStat";
import { MaintenanceFeed } from "@/components/MaintenanceFeed";
import { AddLogForm } from "@/components/AddLogForm";

const queryClient = new QueryClient();

function Dashboard() {
  const { data: roiData } = useQuery({
    queryKey: ['roi'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/roi`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  const savings = roiData?.total_money_saved || "0";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">HVAC Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Monitor your building maintenance and savings.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <HeroStat amount={savings} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MaintenanceFeed />
          <div className="md:col-span-1">
            <AddLogForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
