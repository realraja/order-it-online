import { ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Notification from "@/model/notification";

export const PUT = AdminTryCatch(async (req) => {
  const notifications = await Notification.find({isRead:false}).sort({ createdAt: -1 });

  await Promise.all(notifications.map(async(n)=>{
    // await Notification.findByIdAndDelete(n._id);
    n.isRead = true;
    await n.save();
  }))

  return ResponseSuccess('Notification is readed true!',notifications);
});