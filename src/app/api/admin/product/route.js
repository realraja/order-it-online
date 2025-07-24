import { getSlugFromName } from "@/Constants/SlugMaker";
import { generateRandomString } from "@/middleware/jwt";
import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Product from "@/model/product";

export const GET = AdminTryCatch(async (req) => {
  const product = await Product.find({isChildProduct:false})
    .sort({ createdAt: -1 })
    .populate("variants");

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
    tags,

    isVariants = false,
    isVariantsImage = false,
    variantType,
    variantNameImages = [], // [{name: "Red", image: "..."}, ...]
  } = await req.json();

  // Basic validations
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
  ) {
    return failedResponse("Please fill all required fields!");
  }

  // Handle variants
  let variants = [];

  if (isVariants) {
    if (!variantType || variantNameImages.length === 0) {
      return failedResponse(
        "Please provide variantType and at least one variantName with image."
      );
    }

    // Create child variant products
    variants = await Promise.all(
      variantNameImages.map(async (v) => {
        if (!v.name) return null;

        const Variant = await Product.create({
          name,
          images,
          status,
          description,
          price,
          discountPrice,
          category,
          brand,
          quantity,
          tags,

          imageCover: isVariantsImage ? v.image : imageCover,
          variantName: v.name,
          isChildProduct: true,
          variantType,
          isVariants: false, // variants themselves are not parents
        });

        return Variant._id;
      })
    );

    // Remove nulls (in case any v.name was missing)
    variants = variants.filter(Boolean);
  }

  // Handle slug uniqueness
  let slug = getSlugFromName(name);
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    slug += `-${generateRandomString(6)}`;
  }

  // Create main product
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
    slug,
    tags,

    isVariants,
    variantType,
    variants,
    isVariantsImage,
  });

  return ResponseSuccess("Product added successfully!", product);
});

export const PUT = AdminTryCatch(async (req) => {
  const {
    id,
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
    tags,

    isVariants,
    variantName,
    isVariantsImage,
    variantType,
    variantNameImages = [], // [{name: "Red", image: "..."}, ...]
  } = await req.json();

  // Validate required fields
  if (
    !id ||
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
  ) {
    return failedResponse("Please fill all required fields!");
  }

  let variants = [];

  if (isVariants) {
    if (!variantType || variantNameImages.length === 0) {
      return failedResponse(
        "Please provide variantType and at least one variantName with image."
      );
    }



    // Create updated variant products
    variants = await Promise.all(
      variantNameImages.map(async (v) => {
        if (!v.name) return null;

        const Variant = await Product.create({
          name,
          images,
          status,
          description,
          price,
          discountPrice,
          category,
          brand,
          quantity,
          tags,
          imageCover: isVariantsImage ? v.image : imageCover,
          variantName: v.name,
          variantType,
          isChildProduct: true,
          isVariants: false, // variants themselves are not parent products
        });

        return Variant._id;
      })
    );

    variants = variants.filter(Boolean);
  }

  // Update the main product
  const product = await Product.findByIdAndUpdate(
    id,
    {
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
      tags,

      variantName,
      isVariants,
      isVariantsImage,
      variantType,
    },
    { new: true }
  );

  if(isVariants){

    product.variants.push(variants);
    await product.save();
  }

  return ResponseSuccess("Product updated successfully!", product);
});

export const DELETE = AdminTryCatch(async (req) => {
  const { id } = await req.json();

  if (!id) {
    return failedResponse("Product ID is required for deletion.");
  }

  // First, find the product to check if it's a child
  const product = await Product.findById(id);
  if (!product) {
    return failedResponse("Invalid Product ID");
  }

  // If it's a child product, find and update the parent
  if (product.isChildProduct) {
    // Find the parent product where this product's _id is in the variants array
    await Product.updateOne(
      { variants: id },
      { $pull: { variants: id } }
    );
  }

  // Delete the actual product (child or parent)
  await Product.findByIdAndDelete(id);

  return ResponseSuccess("Product deleted successfully!", product);
});


export const POST3 = AdminTryCatch(async (req) => {
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

    isVariants,
    isVariantsImage,
    variantType,
    variantNameImages = [],
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
  ) {
    return failedResponse("Please fill all required fields!");
  }

  let variants = [];
  if (isVariants) {
    if (!variantType || !variantNameImages) {
      return failedResponse(
        "Please provide variantType and variantName when isVariants is true."
      );
    }

    variants = await Promise.all(
      variantNameImages.map(async (v) => {
        const Variant = await Product.create({
          name,
          images,
          status,
          description,
          price,
          discountPrice,
          category,
          brand,
          quantity,
          imageCover: isVariantsImage ? v.image : imageCover,
          variantName: v.name,

          variantType,
        });

        return Variant._id;
      })
    );

    // return successResponse('variant added',addedVariants)
  }

  let slug = getSlugFromName(name);
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    slug += `-${generateRandomString(6)}`;
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
    slug,

    isVariants,
    variantType,
    variants,
    isVariantsImage,
  });

  await product.populate("variants");

  return ResponseSuccess("Product added successfully!", product);
});

// import { getSlugFromName } from "@/Constants/SlugMaker";
// import { generateRandomString } from "@/middleware/jwt";
// import { failedResponse, ResponseSuccess } from "@/middleware/response";
// import { AdminTryCatch } from "@/middleware/TryCatch";
// import Product from "@/model/product";

// export const GET = AdminTryCatch(async (req) => {
//   const product = await Product.find().sort({ createdAt: -1 });

//   return ResponseSuccess("All Products Fetched successfully!", product);
// });

// export const POST = AdminTryCatch(async (req) => {
//   const {
//     name,
//     images,
//     status,
//     description,
//     price,
//     discountPrice,
//     category,
//     brand,
//     quantity,
//     imageCover,

//     isVariants,
//     variantType,
//     variantName
//   } = await req.json();

//   if (
//     !name ||
//     !images ||
//     !status ||
//     !description ||
//     !price ||
//     !discountPrice ||
//     !category ||
//     !brand ||
//     !quantity ||
//     !imageCover
//   )
//     return failedResponse("please fill all fieleds!");

//   //   console.log(imgUrl,image)

//   let slug = getSlugFromName(name);

//   const existProduct = await Product.find({slug});

//   if(existProduct){
//     slug += `-${generateRandomString(10)}`;
//   }

//   const product = await Product.create({
//     name,
//     images,
//     status,
//     description,
//     price,
//     discountPrice,
//     category,
//     brand,
//     quantity,
//     imageCover,
//     slug,

//     isVariants,
//     variantType,
//     variantName,
//     variants
//   });

//   return ResponseSuccess("product added successfully!", product);
// });

// export const PUT = AdminTryCatch(async (req) => {
//   const {
//     name,
//     images,
//     status,
//     description,
//     price,
//     discountPrice,
//     category,
//     brand,
//     quantity,
//     imageCover,
//     id,

//     isVariants,
//     variantType,
//     variantName,
//     variants
//   } = await req.json();

//   if (
//     !name ||
//     !images ||
//     !status ||
//     !description ||
//     !price ||
//     !discountPrice ||
//     !category ||
//     !brand ||
//     !quantity ||
//     !imageCover ||
//     !id
//   ) {
//     return failedResponse("please fill all fieleds!");
//   }

//   const product = await Product.findByIdAndUpdate(id, {
//     name,
//     images,
//     status,
//     description,
//     price,
//     discountPrice,
//     category,
//     brand,
//     quantity,
//     imageCover,
//     id,

//     isVariants,
//     variantType,
//     variantName,
//     variants
//   });

//   return ResponseSuccess("product Updated successfully!", product);
// });

// export const DELETE = AdminTryCatch(async (req) => {
//   const { id } = await req.json();

//   if (!id) {
//     return failedResponse("please fill all fieleds!");
//   }

//   const product = await Product.findByIdAndDelete(id);

//   if (!product) failedResponse("Invailid Id");

//   return ResponseSuccess("product Deleted successfully!", product);
// });
