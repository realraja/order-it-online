'use client';
import ChartRevenue from "@/components/admin/dashbord/CartRevenue";
import ChartCategories from "@/components/admin/dashbord/ChartCategares";
import ChartOrders from "@/components/admin/dashbord/ChartOrders";
import ChartUsers from "@/components/admin/dashbord/ChartUsers";
import DashboardCards from "@/components/admin/dashbord/DashbordCards";
import { useGetDashbordDataQuery } from "@/redux/api/admin";
import { motion } from 'framer-motion';

export default function Dashboard() { 
  const {data, isLoading} = useGetDashbordDataQuery();

  if (isLoading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center space-y-8 p-6"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Preparing Your Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gathering the latest insights for you...
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg shadow animate-pulse"
            />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg shadow animate-pulse p-4"
            >
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading data, please wait...
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Today</span>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardCards data={data?.data?.cards} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 overflow-auto">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Revenue</h2>
          <ChartRevenue data={data?.data?.monthlyRevenue} />
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Daily Users</h2>
          <ChartUsers data={data?.data?.dailyUsers} />
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Categories</h2>
          <ChartCategories data={data?.data?.productCategories} />
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Trends</h2>
          <ChartOrders data={data?.data?.orderTrends} />
        </div>
      </div>
    </div>
  );
}