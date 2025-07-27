import { ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";
import Review from "@/model/review";

export const GET = SimpleTryCatch(async (req, context) => {
  const { search = "" } = (await context.params) || {};
  const searchRegex = new RegExp(search, "i");

  const products = await Product.aggregate([
    {
      $match: {
        status: "active",
        isChildProduct: false,
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

  const productWithRating = await Promise.all(
    products.map(async (product) => {
      const reviews = await Review.find({ product: product._id,status:'approved' });
      const totalRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      const ratingCount = reviews.length;
      const averageRating =
        ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";

      return {
        ...product,
        rating: averageRating,
        ratingCount,
      };
    })
  );

  return ResponseSuccess("All Products Fetched successfully!", productWithRating);
});
