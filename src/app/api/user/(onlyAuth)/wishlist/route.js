import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { UserTryCatch } from "@/middleware/TryCatch";
import Review from "@/model/review";
import User from "@/model/user";

export const GET = UserTryCatch(async (req) => {

  await req.user.populate('wishlist');

    const productWithRating = await Promise.all(
    req.user.wishlist.map(async (product) => {
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

  return ResponseSuccess("Wishlist get successfully!", productWithRating);
});



export const PUT = UserTryCatch(async (req) => {
  const { product } = await req.json();

  if (!product) {
    return failedResponse("Please provide a product ID!");
  }

  const user = await User.findById(req.id);

  if (!user) {
    return failedResponse("User not found!");
  }

  // Check if product is already in wishlist
  const index = user.wishlist.findIndex((p) => p.toString() === product);

  if (index > -1) {
    // Product exists -> remove it
    user.wishlist.splice(index, 1);
  } else {
    // Product doesn't exist -> add it
    user.wishlist.push(product);
  }

  await user.save();

  return ResponseSuccess("Wishlist updated successfully!", user.wishlist);
});
