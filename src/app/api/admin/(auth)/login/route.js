import { setCookie } from "@/middleware/cookie";
import { signToken } from "@/middleware/jwt";
import { ResponseFailed, ResponseFailedError, ResponseSuccess } from "@/middleware/response";



 
export const POST = async(req)=>{
    const {username,password} = await req.json();
    if(!username || !password) return ResponseFailed('Please fill all the fields!');

    try {    
        if(username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) return ResponseFailed('Invalid username or password!');


        // const token = jwt.sign({username,password},process.env.JWT_SECRET); 
        const token = signToken({username,password});

        const res = ResponseSuccess('Admin Login Successfully',token);

        setCookie(res, token,'/','adminToken');

        return res;

    } catch (error) {
        return ResponseFailedError('Admin Login Failed',error);
    }

    
}
