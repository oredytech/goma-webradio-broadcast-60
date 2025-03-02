
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateMockData = () => {
  const data = [];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  for (let i = 0; i < 12; i++) {
    const newVisitor = Math.floor(Math.random() * 800) + 200;
    const oldVisitor = Math.floor(Math.random() * 600) + 100;
    
    data.push({
      name: months[i],
      'Nouveaux visiteurs': newVisitor,
      'Visiteurs récurrents': oldVisitor,
      'Total': newVisitor + oldVisitor,
    });
  }
  
  return data;
};

const data = generateMockData();

const VisitorsChart = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Visiteurs</h3>
        <div className="flex space-x-2">
          <select className="bg-muted text-sm rounded-md border border-input px-3 py-1">
            <option>Cette année</option>
            <option>Les 6 derniers mois</option>
            <option>Ce mois</option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOld" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="Nouveaux visiteurs" 
              stroke="#f97316" 
              fillOpacity={1} 
              fill="url(#colorNew)" 
            />
            <Area 
              type="monotone" 
              dataKey="Visiteurs récurrents" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorOld)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsChart;
