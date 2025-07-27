import {
  failedResponse,
  ResponseSuccess,
  successResponse,
} from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Notification from "@/model/notification";

export const GET = AdminTryCatch(async (req) => {
  const notifications = await Notification.find()
    .populate("user")
    .sort({ createdAt: -1 });

  return ResponseSuccess("Notification Fetched!", notifications);
});

export const POST = AdminTryCatch(async (req) => {
  const body = await req.json();
  const { title, message } = body;

  if (!title || !message) {
    return failedResponse("Title and message are required.");
  }

  const newNotification = await Notification.create({
    title,
    message,
    type:'admin',
    isRead:true
  });

  return successResponse("Notification send successfully", newNotification);
});

export const PUT = AdminTryCatch(async (req) => {
  const body = await req.json();
  const { title, message, id } = body;

  if (!title || !message || !id) {
    return failedResponse("Title and message are required.");
  }

  const newNotification = await Notification.findByIdAndUpdate(id, {
    title,
    message,
  });

  return successResponse("Notification updated successfully", newNotification);
});
export const DELETE = AdminTryCatch(async (req) => {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return failedResponse("Title and message are required.");
  }

  const newNotification = await Notification.findByIdAndDelete(id);

  return successResponse("Notification deleted successfully", newNotification);
});
