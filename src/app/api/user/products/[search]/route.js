import { ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";

export const GET = SimpleTryCatch(async (req, context) => {
  const { search = "" } = await context.params || {};
  const searchRegex = new RegExp(search, "i");

  const products = await Product.aggregate([
    {
      $match: {
        status: "active",
      },
    },
    {
      $lookup: {
        from: "categories", // collection name in MongoDB
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $match: {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
          { "category.name": searchRegex },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return ResponseSuccess("All Products Fetched successfully!", products);
});
