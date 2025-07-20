import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { UserTryCatch } from "@/middleware/TryCatch";
import User from "@/model/user";

export const GET = UserTryCatch(async (req) => {

  await req.user.populate('wishlist');

  const wishlist = req.user.wishlist.map((p) => {
    return ({
      ...p.toObject(),rating:3.7
    })
  })

  return ResponseSuccess("Wishlist get successfully!", wishlist);
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
