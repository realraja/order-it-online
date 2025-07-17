import { failedResponse, successResponse } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import User from "@/model/user";

export const DELETE = AdminTryCatch(async (req, context) => {
  const params = context.params;
  const id = params.id;

  if (!id) return failedResponse("Please provide valid id");

  const user = await User.findByIdAndDelete(id);
  if (!user) return failedResponse("User not found");

  // Wait for 11 seconds before sending response
//   await new Promise((resolve) => setTimeout(resolve, 11000));

  return successResponse("User deleted successfully", { user });
});
