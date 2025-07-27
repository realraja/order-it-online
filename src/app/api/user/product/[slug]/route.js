import { errorResponse, ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";
import Review from "@/model/review";

export const GET = SimpleTryCatch(async (req, context) => {
  const { slug = "" } = context.params || {};

  // Find the main product by slug (not a child product)
  const product = await Product.findOne({ slug, isChildProduct: false }).populate('variants');

  if (!product) {
    return errorResponse("Product not found", 404);
  }

  // Fetch all reviews for the product and populate user info
  const reviewsData = await Review.find({ product: product._id,status:'approved' }).populate('user');

  const reviews = reviewsData.map(r=> ({...r.toObject(),user:{name:r.user.name,imgUrl:r.user.imgUrl,_id:r.user._id}}))

  // Calculate average rating
  let totalRating = 0;
  let ratingCount = reviews.length;

  for (const r of reviews) {
    totalRating += r.rating || 0; // Handle cases where rating might be missing
  }

  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";

  return ResponseSuccess("Product and reviews fetched successfully!", {
    product,
    reviews,
    rating: averageRating,
    ratingCount,
  });
});
