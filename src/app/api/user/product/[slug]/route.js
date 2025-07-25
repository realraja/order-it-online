import { ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";

export const GET = SimpleTryCatch(async (req, context) => {
  const { slug = "" } = await context.params || {};

  const product = await Product.findOne({slug,isChildProduct:false}).populate('variants');

  return ResponseSuccess("All Products Fetched successfully!", product);
});
