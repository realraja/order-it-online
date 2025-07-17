'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', orders: 4000 },
  { name: 'Feb', orders: 3000 },
  { name: 'Mar', orders: 5000 },
  { name: 'Apr', orders: 2780 },
  { name: 'May', orders: 1890 },
  { name: 'Jun', orders: 2390 },
  { name: 'Jul', orders: 3490 },
];

export default function ChartOrders() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}