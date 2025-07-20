import { failedResponse, ResponseSuccess, successResponse } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Notification from "@/model/notification";

export const GET = SimpleTryCatch(async (req) => {
  const notifications = await Notification.find({type:'admin'}).sort({ createdAt: -1 });

  return ResponseSuccess('Notification Fetched!',notifications);
});

export const POST = SimpleTryCatch(async (req) => {

  const body = await req.json();
  const { user, title, message,email } = body;

  if (!title || !message ) {
    return failedResponse("Title and message are required.")
  }

  const newNotification = await Notification.create({
    user,
    email,
    title,
    message
  });

  return successResponse('Notification send successfully',newNotification)
});
