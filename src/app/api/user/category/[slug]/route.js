import {  ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Category from "@/model/category";
import Product from "@/model/product";

export const GET = SimpleTryCatch(async (req,context) => {
  const params = await context.params;
  const slug = params.slug;

  const category = await Category.findOne({slug});

  const product = await Product.find({status:'active',isChildProduct:false,category:category._id}).sort({ createdAt: -1 })

   const productWithRating = product.map( (p) => {
        // const productCount = await Product.countDocuments({ category: cat._id,status:'active' });
        return {
          ...p.toObject(), // Convert Mongoose doc to plain object
          rating: 4.4,
        };
      })

  return ResponseSuccess("All Products Fetched successfully!", {products:productWithRating,category});
});
