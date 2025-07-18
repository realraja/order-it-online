import { getSlugFromName } from "@/Constants/SlugMaker";
import { uploadResponse } from "@/middleware/cloudinary";
import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Category from "@/model/category";
import Product from "@/model/product";

export const GET = AdminTryCatch(async (req) => {
  // Fetch categories sorted by newest first
  const categories = await Category.find().sort({ createdAt: -1 });

  // Get product counts for each category (parallel optimization)
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat._id });
      return {
        ...cat.toObject(), // Convert Mongoose doc to plain object
        products: productCount,
      };
    })
  );

  return ResponseSuccess("Categories fetched successfully!", categoriesWithCounts);
});

export const POST = AdminTryCatch(async (req) => {
  const { name, image, status } = await req.json();

  if (!name || !image || !status)
    return failedResponse("please fill all fieleds!");

  let imgUrl = await uploadResponse([image]);

//   console.log(imgUrl,image)

  const category = await Category.create({
    name,
    image: imgUrl[0],
    status,
    slug: getSlugFromName(name),
  });

  return ResponseSuccess("Category added successfully!", category);
});

export const PUT = AdminTryCatch(async (req) => {
  const { name, image, status, id } = await req.json();

  if (!name || !image || !status || !id) {
    return failedResponse("please fill all fieleds!");
  }

  const category = await Category.findById(id);

  let imgUrl = category.image;

  if (imgUrl !== image) {
    [imgUrl] = await uploadResponse([image]);
  }

  category.name = name;
  category.image = imgUrl;
  category.status = status;
  category.slug = getSlugFromName(name);
  await category.save();

  return ResponseSuccess("Category Updated successfully!", category);
});

export const DELETE = AdminTryCatch(async (req) => {
  const { id } = await req.json();

  if (!id) {
    return failedResponse("please fill all fieleds!");
  }

  const category = await Category.findByIdAndDelete(id);

  if(!category) failedResponse('Invailid Id');

  return ResponseSuccess("Category Deleted successfully!", category);
});
