import connectDB from "@/database/connectDB";
import { setCookie } from "@/middleware/cookie";
import { signToken } from "@/middleware/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import User from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      email,
      password
    } = body;

    if (!email || !password) {
      return failedResponse("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return failedResponse("Invalid email or password",null, 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return failedResponse("Invalid email or password",null, 401);
    }

    const token = signToken({ email: user.email });

    if(!user.token1) {
      user.token1 = token;
    }else{
        user.token2 = user.token1;
        user.token1 = token;
    }
    await user.save();

    const res = successResponse("Login successful", user);

    setCookie(res, token);

    return res;
  } catch (err) {
    console.log("Login Error:", err);
    return errorResponse("Login failed", err.message);
  }
}
