import connectDB from "@/database/connectDB";
import { failedResponse, ResponseFailed, ResponseFailedError } from "./response";
import { verifyToken } from "./jwt";
import User from "@/model/user";

export const UserTryCatch = (passedFunction) => async (req, context) => {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    // console.log(token);
    if (!token) {
      return ResponseFailed("Please Login First", "token not found");
    }
    const email = verifyToken(token).email;

    if (!email)
      return ResponseFailed("Please Login First", {
        User: false,
        data: "user email not found from token",
      });

    const user = await User.findOne({ email });
    if (!user)
      return ResponseFailed("Please Login First", {
        User: false,
        data: "user Not Found",
      });

    if (user.token1 !== token && user.token2 !== token) {
      const res =  failedResponse('cookie not match');
      res.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/",
      });
      return res;
    }

    // console.log(email);
    req.user = user;
    req.id = user._id;

    return await passedFunction(req, context); // <== forward context (e.g. { params })
  } catch (error) {
    console.log("try catch error: " + error);
    return ResponseFailedError("Internal Server Error", error.message);
  }
};

export const AdminTryCatch = (passedFunction) => async (req, context) => {
  try {
    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return ResponseFailed("Please Login First", "token not found");
    }
    const {username,password} = verifyToken(token);

 


    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      const res =  failedResponse('cookie not match');
      res.cookies.set("adminToken", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/",
      });
      return res;
    }

    await connectDB()

    return await passedFunction(req, context); // <== forward context (e.g. { params })
  } catch (error) {
    console.log("try catch error: " + error);
    return ResponseFailedError("Internal Server Error", error.message);
  }
};

// export const UserTryCatch2 = (passedFunction) => async (req, context) => {
//   try {
//     await connectDB();
//     const {User,data} = await UserAuth(req);
//     if (!User) return ResponseFailed("Please Login First", { User,data });
//     req.user = User;

//     return await passedFunction(req, context); // <== forward context (e.g. { params })
//   } catch (error) {
//     console.log("try catch error: " + error);
//     return ResponseFailedError("Internal Server Error", error.message);
//   }
// };

// export const UserAuth2 = async (req) => {
//     const token = req.cookies.get("token")?.value;

//     console.log(token);
//     const email = verifyToken(token).email;

//   if (!email) return {User:false,data:'user email not found from token'};

//   const user = await User.findOne({email});

//   console.log(user);

//   if (!user) return {User:false,data:'user Not Found'};

//   if (user.token1 !== token && user.token2 !== token) {
//     await cookies().set({
//       name: "Raithan_Token",
//       value: "",
//       httpOnly: true,
//       maxAge: 0,
//     });
//     return {User:false,data:'cookie not match'};
//   }

//   return {User:user,data:'user get success'};
// };
