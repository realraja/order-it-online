import crypto from "crypto";
import { failedResponse, successResponse } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";

const generatedSignature = (
  razorpayOrderId,
  razorpayPaymentId
) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export const POST = SimpleTryCatch(async(req)=>{
  const { orderId, razorpayPaymentId, razorpaySignature } =
    await req.json();

  const signature = generatedSignature(orderId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return failedResponse('payment failed!')
  }

  // Probably some database calls here to update order or add premium status to user
  return successResponse('Payment Done successfully!')
})