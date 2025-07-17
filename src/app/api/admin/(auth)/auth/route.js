import { ResponseSuccess } from "@/middleware/response";
import { AdminTryCatch } from "@/middleware/TryCatch";


export const GET = AdminTryCatch(async(req)=>{
    return ResponseSuccess("Valid Admin",{admin:true});
});



