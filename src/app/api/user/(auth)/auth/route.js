import { ResponseSuccess } from "@/middleware/response";
import { UserTryCatch } from "@/middleware/TryCatch";


export const GET = UserTryCatch(async(req)=>{
    return ResponseSuccess("Valid User",{user:req.user});
});




// export const GET = () => {
//     return ResponseSuccess({message: "Logout successful", statusCode: 200}); 
// }

