import { uploadResponse } from "@/middleware/cloudinary";
import { failedResponse, ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import Image from "@/model/image";

export const GET = AdminTryCatch(async (req) => {
  const image = await Image.find().sort({ createdAt: -1 });

  return ResponseSuccess("All Image Fetched successfully!", image);
});

export const POST = AdminTryCatch(async (req) => {
  const { name, image, pin } = await req.json();

  if (!name || !image )
    return failedResponse("please fill all fieleds!");

  let imgUrl = await uploadResponse([image]);

//   console.log(imgUrl,image)

  const imageData = await Image.create({
    name,
    url: imgUrl[0],
    pin,
  });

  return ResponseSuccess("image added successfully!", imageData);
});

export const PUT = AdminTryCatch(async (req) => {
  const { name, image, pin, id } = await req.json();

  if (!name || !image || !id) {
    return failedResponse("please fill all fieleds!");
  }

  const imageData = await Image.findById(id);

  let imgUrl = imageData.url;

  if (imgUrl !== image) {
    [imgUrl] = await uploadResponse([image]);
  }

  imageData.name = name;
  imageData.url = imgUrl;
  imageData.pin = pin;
  await imageData.save();

  return ResponseSuccess("image Updated successfully!", imageData);
});

export const DELETE = AdminTryCatch(async (req) => {
  const { id } = await req.json();

  if (!id) {
    return failedResponse("please fill all fieleds!");
  }

  const image = await Image.findByIdAndDelete(id);

  if(!image) failedResponse('Invailid Id');

  return ResponseSuccess("image Deleted successfully!", image);
});
