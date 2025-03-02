
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'RDC', value: 65 },
  { name: 'France', value: 15 },
  { name: 'Belgique', value: 10 },
  { name: 'Autres', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'];

const DemographicsChart = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
      <h3 className="text-lg font-medium mb-6">Démographie des visiteurs</h3>
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
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
    </div>
  );
};

export default DemographicsChart;
