import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Order from "@/model/order";

export const GET = AdminTryCatch(async (req) => {
  const order = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });

  return ResponseSuccess("All orders Fetched successfully!", order);
});

export const PUT = AdminTryCatch(async (req) => {
  const {paymentStatus,orderStatus,id} = await req.json();

  if (
    !paymentStatus || !id || !orderStatus
  ) {
    return failedResponse("please fill all fieleds!");
  }

  const order = await Order.findByIdAndUpdate(id, {paymentStatus ,orderStatus});

  return ResponseSuccess("order Updated successfully!", order);
});

export const DELETE = AdminTryCatch(async (req) => {
  const { id } = await req.json();

  if (!id) {
    return failedResponse("please fill all fieleds!");
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) failedResponse("Invailid Id");

  return ResponseSuccess("product Deleted successfully!", order);
});
