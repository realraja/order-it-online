
import connectDB from '@/database/connectDB';
import { verifyToken } from '@/middleware/jwt';
import { errorResponse, failedResponse, successResponse } from '@/middleware/response';
import User from '@/model/user';

export async function GET(req) {
  await connectDB();

  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return failedResponse('Already logged out');
    }

    const decoded = verifyToken(token);
    if (!decoded?.email) {
      return failedResponse('Invalid token');
    }


    // console.log(decoded)

    const user = await User.findOne({ email: decoded.email });
    if (user) {
      if(user.token1 === token) {
        user.token1 = null;
      }else{
        user.token2 = null;
      }
      await user.save();
    }

    const res = successResponse('Logout successful',user);

    res.cookies.set('token', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
      path: '/',
    });

    return res;
  } catch (err) {
    console.log('Logout Error:', err);
    return errorResponse('Logout failed', err.message);
  }
}
