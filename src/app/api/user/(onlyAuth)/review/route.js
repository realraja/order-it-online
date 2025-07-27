import { UserTryCatch } from "@/middleware/TryCatch";
import { uploadResponse } from "@/middleware/cloudinary";
import { failedResponse, ResponseSuccess } from "@/middleware/response";
import Order from "@/model/order";
import Product from "@/model/product";
import Review from "@/model/review";

// export const GET = SimpleTryCatch(async (req, context) => {
//   const { slug = "" } = await context.params || {};

//   const review = await Review.findOne({slug}).populate('user');

//   return ResponseSuccess("All Reviews Fetched successfully!", review);
// });
export const POST = UserTryCatch(async (req) => {
  const {
    slug,review,images,rating,orderId
  } = await req.json(); 
  // console.log(slug,review,images,rating)

  if (!slug || !review || !rating || !orderId) {
    return failedResponse("please provide all cridentials.");
  }

  let imgUrl;

  if(images.length > 0){
    imgUrl = await uploadResponse(images);
  }

  const product = await Product.findOne({slug,isChildProduct:false});

  const reviewData = await Review.create({
    rating,review,product:product._id,user:req.id,images:images.length > 0 ? imgUrl:product.imageCover
  });

  const order = await Order.findById(orderId);

  order.review = reviewData._id;
  await order.save();




  return ResponseSuccess("Review added successfully", reviewData);
});
