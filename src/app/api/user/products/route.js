import { ResponseSuccess } from "@/middleware/response";
import { SimpleTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";

export const GET = SimpleTryCatch(async (req, context) => {
  // Get page and limit from search params
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalProducts = await Product.countDocuments({ status: 'active' });

  // Fetch paginated products
  const products = await Product.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const productWithRating = products.map((p) => ({
    ...p.toObject(),
    rating: 4.4,
  }));

  return ResponseSuccess("Paginated products fetched successfully!", {
    products: productWithRating,
    pagination: {
      totalItems: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      pageSize: limit,
    },
  });
});
