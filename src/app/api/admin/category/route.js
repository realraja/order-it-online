import { getSlugFromName } from "@/Constants/SlugMaker";
import { uploadResponse } from "@/middleware/cloudinary";
import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Category from "@/model/category";

export const GET = AdminTryCatch(async (req) => {
  const category = await Category.find().sort({ createdAt: -1 });

  return ResponseSuccess("All users Fetched successfully!", category);
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
