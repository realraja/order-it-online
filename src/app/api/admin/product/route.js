import { getSlugFromName } from "@/Constants/SlugMaker";
import { generateRandomString } from "@/middleware/jwt";
import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";

export const GET = AdminTryCatch(async (req) => {
  const product = await Product.find().sort({ createdAt: -1 });

  return ResponseSuccess("All Products Fetched successfully!", product);
});

export const POST = AdminTryCatch(async (req) => {
  const {
    name,
    images,
    status,
    description,
    price,
    discountPrice,
    category,
    brand,
    quantity,
    imageCover,
  } = await req.json();

  if (
    !name ||
    !images ||
    !status ||
    !description ||
    !price ||
    !discountPrice ||
    !category ||
    !brand ||
    !quantity ||
    !imageCover
  )
    return failedResponse("please fill all fieleds!");

  //   console.log(imgUrl,image)

  let slug = getSlugFromName(name);

  const existProduct = await Product.find({slug});

  if(existProduct){
    slug += `-${generateRandomString(10)}`;
  }

  const product = await Product.create({
    name,
    images,
    status,
    description,
    price,
    discountPrice,
    category,
    brand,
    quantity,
    imageCover,
    slug
  });

  return ResponseSuccess("product added successfully!", product);
});

export const PUT = AdminTryCatch(async (req) => {
  const {
    name,
    images,
    status,
    description,
    price,
    discountPrice,
    category,
    brand,
    quantity,
    imageCover,
    id,
  } = await req.json();

  if (
    !name ||
    !images ||
    !status ||
    !description ||
    !price ||
    !discountPrice ||
    !category ||
    !brand ||
    !quantity ||
    !imageCover ||
    !id
  ) {
    return failedResponse("please fill all fieleds!");
  }

  const product = await Product.findByIdAndUpdate(id, {
    name,
    images,
    status,
    description,
    price,
    discountPrice,
    category,
    brand,
    quantity,
    imageCover,
    id,
  });

  return ResponseSuccess("product Updated successfully!", product);
});

export const DELETE = AdminTryCatch(async (req) => {
  const { id } = await req.json();

  if (!id) {
    return failedResponse("please fill all fieleds!");
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) failedResponse("Invailid Id");

  return ResponseSuccess("product Deleted successfully!", product);
});
