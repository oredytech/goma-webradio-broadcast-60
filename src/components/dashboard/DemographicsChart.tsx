
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface DemographicsData {
  country: string;
  visitors: number;
}

interface DemographicsChartProps {
  data?: DemographicsData[];
  isLoading?: boolean;
}

const defaultData = [
  { country: 'RDC', visitors: 65 },
  { country: 'France', visitors: 15 },
  { country: 'Belgique', visitors: 10 },
  { country: 'Autres', visitors: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

const DemographicsChart = ({ data = defaultData, isLoading = false }: DemographicsChartProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
      <h3 className="text-lg font-medium mb-6">Démographie des visiteurs</h3>
      
      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="visitors"
                nameKey="country"
                label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DemographicsChart;
