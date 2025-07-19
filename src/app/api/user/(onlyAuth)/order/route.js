import Order from "@/model/order";
import { UserTryCatch } from "@/middleware/TryCatch";
import { failedResponse, ResponseSuccess, successResponse } from "@/middleware/response";

export const GET = UserTryCatch(async(req)=>{
    const orders = await Order.find({user:req.id});
    return successResponse('Order Fetched!',orders)
})

export const POST = UserTryCatch(async (req) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus = "pending",
    paymentDetails = {},
    totalAmount,
    coupon,
  } = await req.json();

  if (!items || items.length === 0) {
    return failedResponse("Order must contain at least one item.");
  }

  if (!paymentMethod || !totalAmount) {
    return failedResponse("Payment method and total amount are required.");
  }

  const order = await Order.create({
    user: req.id, // from UserTryCatch middleware
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    paymentDetails,
    totalAmount,
    coupon,
  });

  req.user.cart = [];
  await req.user.save();

  return ResponseSuccess("Order placed successfully", order);
});
