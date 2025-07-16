import connectDB from "@/database/connectDB";
import { generateRandomString, signToken } from "@/middleware/jwt";
import { errorResponse, failedResponse, successResponse } from "@/middleware/response";
import { sendMail } from "@/middleware/sendEmail";
import User from "@/model/user";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      email
    } = body;

    if (!email) {
      return failedResponse("Email are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return failedResponse("You are not a user email",null, 401);
    }

    const resetToken = generateRandomString(32);
    const passwordResetToken = signToken({token:resetToken,email});

    const {error,message} = await sendMail(email, passwordResetToken);

    if (error) {
      return errorResponse("Email sending failed", message);
    }


    user.passwordResetToken = resetToken;
    user.passwordResetTokenExp = new Date(Date.now() + process.env.OTP_EXPIRY_TIME * 60 * 1000);
    await user.save();

    const res = successResponse("Password Link Sent On "+ email,user);


    return res;
  } catch (err) {
    console.log("send email Error:", err);
    return errorResponse("send email failed", err.message);
  }
}
