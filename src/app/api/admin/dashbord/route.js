import { successResponse } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Category from "@/model/category";
import Image from "@/model/image";
import Notification from "@/model/notification";
import Order from "@/model/order";
import Product from "@/model/product";
import User from "@/model/user";

export const GET = AdminTryCatch(async (req) => {
  // Basic counts
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  const categories = await Category.countDocuments();
  const images = await Image.countDocuments();
  const notifications = await Notification.countDocuments();
  const orders = await Order.find();

  // Total revenue calculation
  let revenue = 0;
  orders.forEach((o) => {
    revenue += o.totalAmount;
  });

  // Monthly revenue calculation
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyMap = new Array(12).fill(0);
  orders.forEach((order) => {
    const month = new Date(order.createdAt).getMonth(); // 0-11
    monthlyMap[month] += order.totalAmount;
  });

  const monthlyRevenue = monthNames.map((name, index) => ({
    name,
    revenue: monthlyMap[index],
  }));

  // Daily users calculation (last 7 days)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyUsersMap = new Array(7).fill(0);
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentUsers = await User.find({
    createdAt: { $gte: sevenDaysAgo }
  }).select('createdAt');

  recentUsers.forEach(user => {
    const day = new Date(user.createdAt).getDay(); // 0-6 (Sun-Sat)
    dailyUsersMap[day]++;
  });

  const dailyUsers = dayNames.map((name, index) => ({
    name,
    users: dailyUsersMap[index]
  }));

  // Product categories count
  const productCategories = await Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData'
      }
    },
    {
      $unwind: '$categoryData'
    },
    {
      $group: {
        _id: '$categoryData.name',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        name: '$_id',
        value: '$count',
        _id: 0
      }
    },
    {
      $sort: { value: -1 }
    }
  ]);

  // If you want to include an "Other" category for products without categories
  const otherProductsCount = await Product.countDocuments({ category: null });
  if (otherProductsCount > 0) {
    productCategories.push({ name: 'Other', value: otherProductsCount });
  }

  // Order trends for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const orderTrends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        name: {
          $let: {
            vars: {
              months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            in: {
              $arrayElemAt: ['$$months', { $subtract: ['$_id', 1] }]
            }
          }
        },
        orders: '$count',
        _id: 0
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Fill in missing months with 0 orders
  const currentMonth = new Date().getMonth();
  const completeOrderTrends = [];
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    const monthName = monthNames[monthIndex];
    const foundMonth = orderTrends.find(m => m.name === monthName);
    completeOrderTrends.push(foundMonth || { name: monthName, orders: 0 });
  }

  return successResponse('Dashboard data fetched successfully!', {
    cards: {
      users,
      products,
      categories,
      images,
      notifications,
      orders: orders.length,
      revenue,
    },
    monthlyRevenue,
    dailyUsers,
    productCategories,
    orderTrends: completeOrderTrends
  });
});
