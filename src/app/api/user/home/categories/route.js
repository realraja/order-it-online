import {ResponseSuccess } from "@/middleware/response";
import {  SimpleTryCatch } from "@/middleware/TryCatch";
import Category from "@/model/category";
import Product from "@/model/product";

export const GET = SimpleTryCatch(async (req) => {
  // Fetch categories sorted by newest first
  const categories = await Category.find({status:'active'}).sort({ createdAt: -1 });

  // Get product counts for each category (parallel optimization)
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat._id,status:'active' });
      return {
        ...cat.toObject(), // Convert Mongoose doc to plain object
        products: productCount,
      };
    })
  );

  return ResponseSuccess("Categories fetched successfully!", categoriesWithCounts);
});
