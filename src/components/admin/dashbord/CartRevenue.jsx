// components/admin/ChartRevenue.js
'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// const dataLocal = [
//   { name: 'Jan', revenue: 4000 },
//   { name: 'Feb', revenue: 3000 },
//   { name: 'Mar', revenue: 5000 },
//   { name: 'Apr', revenue: 2780 },
//   { name: 'May', revenue: 1890 },
//   { name: 'Jun', revenue: 2390 },
//   { name: 'Jul', revenue: 3490 },
//   { name: 'Aug', revenue: 4000 },
//   { name: 'Sep', revenue: 5000 },
//   { name: 'Oct', revenue: 6000 },
//   { name: 'Nov', revenue: 7000 },
//   { name: 'Dec', revenue: 8000 },
// ];

export default function ChartRevenue({data }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{ backgroundColor: '#1f2937', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#f9fafb' }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#6366f1" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
