import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { UserTryCatch } from "@/middleware/TryCatch";
import User from "@/model/user";

export const PUT = UserTryCatch(async (req) => {
  const { product, quantity = 1 } = await req.json();

  console.log(product,quantity)

  if (!product) {
    return failedResponse("Please provide a product ID!");
  }

  const user = await User.findById(req.id);

  if (!user) {
    return failedResponse("User not found!");
  }

  // Check if the product already exists in cart
  const existingItem = user.cart.find(
    (item) => item.product.toString() === product
  );

  if (existingItem) {
    // If already in cart, increment quantity
    existingItem.quantity += quantity;
  } else {
    // Else, push new item to cart
    user.cart.push({
      product,
      quantity,
    });
  }

  await user.save();

  return ResponseSuccess("Cart updated successfully!", user.cart);
});



export const DELETE = UserTryCatch(async (req) => {
  const { product } = await req.json();

  if (!product) {
    return failedResponse("Please provide a product ID!");
  } 

  const user = await User.findById(req.id);

  if (!user) {
    return failedResponse("User not found!");
  }

  const initialLength = user.cart.length;

  // console.log(user.cart[0].product.toString(),product)

  // Filter out the product to remove it
  user.cart = user.cart.filter(
    (item) => item.product.toString() !== product.toString()
  );

  if (user.cart.length === initialLength) {
    return failedResponse("Product not found in cart!");
  }

  await user.save();

  return ResponseSuccess("Product removed from cart!", user.cart);
});