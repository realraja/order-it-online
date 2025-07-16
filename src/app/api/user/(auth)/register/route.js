import bcrypt from "bcryptjs";
import { setCookie } from "@/middleware/cookie";
import connectDB from "@/database/connectDB";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import User from "@/model/user";
import { uploadResponse } from "@/middleware/cloudinary";
import { signToken } from "@/middleware/jwt";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const {
    name,
    email,
    phone,
    password,
    dob,
    image,  
  } = body;

//   console.log('running register route',name, email, phone, password, dob, image);

  if (!name || !email || !password || !dob || !phone) {
    return failedResponse("All fields are required");
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return failedResponse("Invalid email");
  }

  const dobYear = new Date(dob).getFullYear();
  const nowYear = new Date().getFullYear();
  if (dobYear < 1950 || dobYear >= nowYear) {
    return failedResponse(`DOB year must be between 1950 and ${nowYear - 1}`);
  }

  if (password.length < 8 || !/\d/.test(password)) {
    return failedResponse(
      "Password must be at least 8 characters and include a number"
    );
  }
  try {

    const existing = await User.findOne({ email });
    if (existing) return failedResponse("Email or phone already registered");

    let imgUrl = undefined;

    if (image) {
      imgUrl = await uploadResponse([image]);
    }

    // console.log(imgUrl);

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = signToken({email}); // JWT creation

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      dob: new Date(dob),
      imgUrl: imgUrl ? imgUrl[0] : undefined,
      token1: token,
    });

    const res = successResponse("User registered successfully", user);

    setCookie(res, token);

    return res;
  } catch (err) {
    console.log("Register Error:", err);
    return errorResponse("Registration failed", err);
  }
}
