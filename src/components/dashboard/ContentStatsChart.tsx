
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Articles', value: 24 },
  { name: 'Podcasts', value: 16 },
  { name: 'Vidéos', value: 12 },
  { name: 'Galerie', value: 18 },
];

const ContentStatsChart = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
      <h3 className="text-lg font-medium mb-6">Statistiques de contenu</h3>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} éléments`, 'Quantité']}
            />
            <Bar 
              dataKey="value" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentStatsChart;
