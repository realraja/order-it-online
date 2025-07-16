import connectDB from "@/database/connectDB";
import { verifyToken } from "@/middleware/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import User from "@/model/user";
import bcrypt from "bcryptjs";




export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      password,token
    } = body;

    if (!password,!token) {
      return failedResponse("Email and Token are required");
    }

    const {email,token:checkToken} = verifyToken(token);



    const user = await User.findOne({ email }).select("+password +passwordResetToken +passwordResetTokenExp");
    if (!user) {
      return failedResponse("Invalid email",null, 401);
    }

// console.log(token,user.passwordResetToken)
    if (checkToken !== user.passwordResetToken || user.passwordResetTokenExp < new Date()) {
      user.passwordResetToken = undefined; // Clear the password reset token
      user.passwordResetTokenExp = undefined; // Clear the password reset token expiration
      await user.save();
      return failedResponse("token expired",null, 401);
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    user.passwordResetTokenExp = undefined; // Clear the password reset token
    user.passwordResetToken = undefined; // Clear the password reset token
    user.password = hashedPassword;
    user.token1 = undefined; // Clear the old token
    user.token2 = undefined; // Clear the old token
    await user.save();

    const res = successResponse("Password reset successfully! Now login please.", user);
    return res;
  } catch (err) {
    console.log("reset password Error:", err);
    return errorResponse("reset password failed", err.message);
  }
}
