import connectDB from "@/database/connectDB";
import { signToken } from "@/middleware/jwt";
import {
  errorResponse,
  ResponseFailed,
  successResponse,
} from "@/middleware/response";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "@/model/user";
import { uploadResponse } from "@/middleware/cloudinary";
import { setCookie } from "@/middleware/cookie";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { googleToken } = body;
    if (!googleToken) {
      return ResponseFailed("token is required!");
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // console.log(payload);

    const email = payload?.email;
    if (!email) {
      return ResponseFailed("invailid Token!");
    }

    // console.log(payload);

    const user = await User.findOne({ email });

    if (!user) {
      let imgUrl = undefined;

      if (payload.picture) {
        imgUrl = await uploadResponse([payload.picture]);
      }

      // console.log(imgUrl);

      const hashedPassword = await bcrypt.hash(payload.name + email, 10);
      const token = signToken({ email }); // JWT creation

      const user = await User.create({
        name:payload.name,
        email,
        password: hashedPassword,
        imgUrl: imgUrl ? imgUrl[0] : undefined,
        token1: token,
      });

      const res = successResponse("User registered successfully", user);

      setCookie(res, token);

      return res;
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
  } catch (error) {
    console.log("Google auth error:", error);
    return errorResponse("google auth error", error.message);
  }
};
