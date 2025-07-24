import {  ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";

export const GET = SimpleTryCatch(async (req) => {
  const product = await Product.find({status:'active',isChildProduct:false}).sort({ createdAt: -1 }).limit(10);

   const productWithRating = product.map( (p) => {
        // const productCount = await Product.countDocuments({ category: cat._id,status:'active' });
        return {
          ...p.toObject(), // Convert Mongoose doc to plain object
          rating: 4.4,
        };
      })

  return ResponseSuccess("All Products Fetched successfully!", productWithRating);
});
