
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface VisitorData {
  date: string;
  visitors: number;
}

interface VisitorsChartProps {
  data?: VisitorData[];
  isLoading?: boolean;
}

const defaultData = [
  { date: 'Lun', visitors: 45 },
  { date: 'Mar', visitors: 52 },
  { date: 'Mer', visitors: 48 },
  { date: 'Jeu', visitors: 61 },
  { date: 'Ven', visitors: 55 },
  { date: 'Sam', visitors: 67 },
  { date: 'Dim', visitors: 62 },
];

const VisitorsChart = ({ data = defaultData, isLoading = false }: VisitorsChartProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Visiteurs par jour</h3>
        <div className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
          Derniers 7 jours
        </div>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} visiteurs`, 'Visiteurs']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                name="Visiteurs"
                stroke="#10b981" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default VisitorsChart;
