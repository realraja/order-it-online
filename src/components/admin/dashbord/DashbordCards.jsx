// components/admin/DashboardCards.js
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, Image, Bell, Factory } from 'lucide-react';

export default function DashboardCards({data}) {
  // const stats = [
  //   { name: 'Total Users', value: '2,345', icon: Users, change: '+12%', changeType: 'positive' },
  //   { name: 'Total Products', value: '1,234', icon: Package, change: '+5%', changeType: 'positive' },
  //   { name: 'Total Orders', value: '567', icon: ShoppingBag, change: '-2%', changeType: 'negative' },
  //   { name: 'Revenue', value: '$24,567', icon: DollarSign, change: '+18%', changeType: 'positive' },
  //   { name: 'New Signups', value: '89', icon: TrendingUp, change: '+7%', changeType: 'positive' },
  // ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <Users className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.users}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <Package className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Products
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.products}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Orders
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.orders}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <DollarSign className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Revenue
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.revenue}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <Factory className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Categories
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.categories}
              </div>
            </div>
          </div>
        </div>
      </div>
      


      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <Bell className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Notifications
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.notifications}
              </div>
            </div>
          </div>
        </div>
      </div>
      


      <div
        className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3 text-white">
            <Image className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 flex-1">
            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Images
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {data.images}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}