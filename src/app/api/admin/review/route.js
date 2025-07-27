import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Review from "@/model/review";

export const GET = AdminTryCatch(async (req, context) => {

  const review = await Review.find().populate('user').populate('product').sort({ createdAt: -1 }).sort({ status: -1 });

  return ResponseSuccess("All Reviews Fetched successfully!", review);
});


export const PUT = AdminTryCatch(async (req) => {
  const {
    id,status
  } = await req.json(); 
  // console.log(slug,review,images,rating)

  if (!status || !id) {
    return failedResponse("please provide all cridentials.");
  }


  const reviewData = await Review.findByIdAndUpdate(id,{status});

  return ResponseSuccess("Review updated successfully", reviewData);
});
