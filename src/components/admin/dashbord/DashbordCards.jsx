// components/admin/DashboardCards.js
import { Users, ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react';

export default function DashboardCards() {
  const stats = [
    { name: 'Total Users', value: '2,345', icon: Users, change: '+12%', changeType: 'positive' },
    { name: 'Total Products', value: '1,234', icon: Package, change: '+5%', changeType: 'positive' },
    { name: 'Total Orders', value: '567', icon: ShoppingBag, change: '-2%', changeType: 'negative' },
    { name: 'Revenue', value: '$24,567', icon: DollarSign, change: '+18%', changeType: 'positive' },
    { name: 'New Signups', value: '89', icon: TrendingUp, change: '+7%', changeType: 'positive' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
              <stat.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </div>
              </dd>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}