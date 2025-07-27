'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const dataLocal = [
//   { name: 'Electronics', value: 400 },
//   { name: 'Clothing', value: 300 },
//   { name: 'Home & Kitchen', value: 300 },
//   { name: 'Books', value: 200 },
//   { name: 'Other', value: 100 },
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8','#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ChartCategories({data}) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}