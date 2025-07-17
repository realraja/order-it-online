import { ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";




export const GET = AdminTryCatch(async(req)=>{
    const res = ResponseSuccess('Admin Logout Successfully');
    res.cookies.set("adminToken", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/",
      });

    return res
})