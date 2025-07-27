import Order from "@/model/order";
import { UserTryCatch } from "@/middleware/TryCatch";
import {
  failedResponse,
  ResponseSuccess,
  successResponse,
} from "@/middleware/response";
import Product from "@/model/product";

export const GET = UserTryCatch(async (req) => {
  const orders = await Order.find({ user: req.id }).populate("item.product").populate("review").sort({ createdAt: -1 });
  return successResponse("Order Fetched!", orders);
});


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

  let calculatedTotal = 0;

  const orders = await Promise.all(
    items.map(async (p) => {
      const product = await Product.findById(p.product);

      if (!product) {
        throw new Error("Product not found.");
      }

      if (product.quantity < p.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      product.quantity -= p.quantity;
      product.sold += p.quantity;
      await product.save();

      const itemTotal = product.discountPrice * p.quantity;
      calculatedTotal += itemTotal;

      const order = await Order.create({
        user: req.id, // from UserTryCatch middleware
        item: {
          product: product._id,
          quantity: p.quantity,
          price: product.discountPrice,
        },
        shippingAddress,
        paymentMethod,
        paymentStatus,
        paymentDetails,
        totalAmount: itemTotal,
        coupon,
      });

      return order;
    })
  );

  // Optional: Validate the total amount client sent matches actual amount
  // if (parseFloat(totalAmount) !== parseFloat(calculatedTotal.toFixed(2))) {
  //   return failedResponse("Total amount mismatch.");
  // }

  req.user.cart = [];
  await req.user.save();

  return ResponseSuccess("Order placed successfully", orders);
});



export const DELETE = UserTryCatch(async (req) => {
  const { id } = await req.json();
  const order = await Order.findById(id);

  order.orderStatus = "cancelled";
  await order.save();
  return successResponse("Order Cancelled!", order);
});





































export const POSTs = UserTryCatch(async (req) => {
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

  const orders = await Promise.all(
    items.map(async (p) => {
      const product = await Product.findById(p.product);

      product.quantity -= p.quantity;
      product.sold += p.quantity;
      await product.save();


      const order = await Order.create({
        user: req.id, // from UserTryCatch middleware
        item:{product:product._id,quantity:p.quantity},
        shippingAddress,
        paymentMethod,
        paymentStatus,
        paymentDetails,
        totalAmount:product.discountPrice,
        coupon,
      });

      return order;
    })
  );

  return ResponseSuccess("Order placed successfully", orders);
});