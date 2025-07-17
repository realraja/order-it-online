import { ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";
import User from "@/model/user";


export const GET = AdminTryCatch(async(req)=>{
    const users = await User.find().sort({createdAt:-1});

    return ResponseSuccess('All users Fetched successfully!',{users});
});



