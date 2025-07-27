import { ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";
import Review from "@/model/review";

export const GET = SimpleTryCatch(async (req, context) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  // Total active parent products
  const totalProducts = await Product.countDocuments({ status: "active", isChildProduct: false });

  // Fetch paginated products
  const products = await Product.find({ status: "active", isChildProduct: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Calculate ratings for each product
  const productWithRating = await Promise.all(
    products.map(async (product) => {
      const reviews = await Review.find({ product: product._id ,status:'approved'});
      const totalRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      const ratingCount = reviews.length;
      const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";

      return {
        ...product?.toObject(),
        rating: averageRating,
        ratingCount,
      };
    })
  );

  return ResponseSuccess("Paginated products fetched successfully!", {
    products: productWithRating,
    pagination: {
      totalItems: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      pageSize: limit,
    },
  });
});
