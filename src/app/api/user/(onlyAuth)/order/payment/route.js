import { successResponse } from "@/middleware/response";

const Razorpay = require("razorpay");


const razorpay = new Razorpay({
    key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET_ID
});


export const POST = async(req) =>{
    const {amount} = await req.json();

    const paymentOrder = await razorpay.orders.create({amount,currency:"INR"});


    return successResponse('Payment order recevied',paymentOrder);
}