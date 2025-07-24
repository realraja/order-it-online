import Order from "@/model/order";
import { UserTryCatch } from "@/middleware/TryCatch";
import { failedResponse, ResponseSuccess, successResponse } from "@/middleware/response";
import Product from "@/model/product";

export const GET = UserTryCatch(async(req)=>{
    const orders = await Order.find({user:req.id}).populate('items.product');
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

  await Promise.all(items.map(async(p) => {
    const product = await Product.findById(p.product);

    product.quantity -= p.quantity;
    product.sold += p.quantity;
    await product.save();
  }))

  req.user.cart = [];
  await req.user.save();

  return ResponseSuccess("Order placed successfully", order);
});
