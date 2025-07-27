import { ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Category from "@/model/category";
import Product from "@/model/product";
import Review from "@/model/review";

export const GET = SimpleTryCatch(async (req, context) => {
  const params = await context.params;
  const slug = params.slug;

  const category = await Category.findOne({ slug });

  const products = await Product.find({
    status: "active",
    isChildProduct: false,
    category: category._id,
  }).sort({ createdAt: -1 });

  const productWithRating = await Promise.all(
    products.map(async (product) => {
      const reviews = await Review.find({ product: product._id,status:'approved' });
      const totalRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      const ratingCount = reviews.length;
      const averageRating =
        ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";

      return {
        ...product?.toObject(),
        rating: averageRating,
        ratingCount,
      };
    })
  );

  return ResponseSuccess("All Products Fetched successfully!", {
    products: productWithRating,
    category,
  });
});
