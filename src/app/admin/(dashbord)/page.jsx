
import ChartRevenue from "@/components/admin/dashbord/CartRevenue";
import ChartCategories from "@/components/admin/dashbord/ChartCategares";
import ChartOrders from "@/components/admin/dashbord/ChartOrders";
import ChartUsers from "@/components/admin/dashbord/ChartUsers";
import DashboardCards from "@/components/admin/dashbord/DashbordCards";

export default function Dashboard() {
  return (
      <div className="space-y-6 overflow-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Today</span>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardCards />

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 overflow-auto">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Revenue</h2>
            <ChartRevenue />
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Daily Users</h2>
            <ChartUsers />
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Categories</h2>
            <ChartCategories />
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Trends</h2>
            <ChartOrders />
          </div>
        </div>
      </div>
  );
}