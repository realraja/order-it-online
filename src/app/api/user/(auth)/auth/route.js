import { ResponseSuccess } from "@/middleware/response";
import { UserTryCatch } from "@/middleware/TryCatch";
// import Product from "@/model/product";
import User from "@/model/user";

export const GET = UserTryCatch(async (req) => {
  const user = await User.findById(req.id)
    .populate('wishlist')        // Populates wishlist products
    .populate('cart.product');   // Populates product in each cart item

  return ResponseSuccess("Valid User", { user });
});
