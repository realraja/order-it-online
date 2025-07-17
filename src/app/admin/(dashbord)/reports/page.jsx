// pages/admin/reports.js

export default function Reports() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Sales Report</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <select className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
                <div className="text-sm text-gray-500 dark:text-gray-300">Total: $24,567.89</div>
              </div>
              {/* Chart would go here */}
              <div className="mt-4 h-64 bg-gray-100 dark:bg-gray-700"></div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Top Products</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <select className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option>By revenue</option>
                  <option>By units sold</option>
                </select>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  { name: 'Wireless Headphones', value: 12500, percentage: 35 },
                  { name: 'Smart Watch', value: 9800, percentage: 28 },
                  { name: 'Bluetooth Speaker', value: 7500, percentage: 21 },
                  { name: 'Coffee Mug', value: 3200, percentage: 9 },
                  { name: 'Cotton T-Shirt', value: 2100, percentage: 6 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        ${item.value.toLocaleString()}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-indigo-600"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Customer Activity</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <select className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
              {/* Chart would go here */}
              <div className="mt-4 h-64 bg-gray-100 dark:bg-gray-700"></div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Top Customers</h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <select className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option>By spending</option>
                  <option>By orders</option>
                </select>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  { name: 'John Doe', value: 1850, orders: 7 },
                  { name: 'Jane Smith', value: 1620, orders: 5 },
                  { name: 'Bob Johnson', value: 1340, orders: 4 },
                  { name: 'Alice Williams', value: 980, orders: 3 },
                  { name: 'Charlie Brown', value: 750, orders: 2 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      ${item.value.toLocaleString()} ({item.orders} orders)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}