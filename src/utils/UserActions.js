import axios from "axios";
import { toast } from "react-toastify";

const userTryCatchServer = (passedFunction) => async (data) => {
  try {
    return await passedFunction(data);
  } catch (error) {
    console.log(error,error.message);
    return error
    // return {success:false,message:error.response?.data.message ? error.response.data.message:error.message,data:error.response?.data.data ? error.response.data.data:null};
  }
};
const userTryCatch = (passedFunction) => async (data) => {
  try {
    return await passedFunction(data);
  } catch (error) {
    // console.log(error,error.message);
    return toast.error(
      error.response?.data.message ? error.response.data.message : error.message
    );
    // return {success:false,message:error.response?.data.message ? error.response.data.message:error.message,data:error.response?.data.data ? error.response.data.data:null};
  }
};

export const CheckAuthUser = async () => {
  try {
    const { data } = await axios.get(`/api/user/auth`);
    return data;
  } catch (error) {
    return {success:false,message:error.response?.data.message ? error.response.data.message:error.message,data:error.response?.data.data ? error.response.data.data:null};
  }
};


export const RegisterUser = userTryCatch(async (userData = {}) => {
  const { data } = await axios.post("/api/user/register", userData);
  toast.success(
    data.message ? data.message : "User data fetched successfully",
    { autoClose: 2000 }
  );
  return data;
});
export const LoginUser = userTryCatch(async (userData = {}) => {
  const { data } = await axios.post("/api/user/login", userData);
  toast.success(
    data.message ? data.message : "User data fetched successfully",
    { autoClose: 2000 }
  );
  return data;
});
export const GoogleLoginUser = userTryCatch(async (userData = {}) => {
  const { data } = await axios.post("/api/user/google", userData);
  toast.success(
    data.message ? data.message : "User data fetched successfully",
    { autoClose: 2000 }
  );
  return data;
});
export const SendResetPasswordLinkUser = userTryCatch(async (userData = {}) => {
  const { data } = await axios.post(
    "/api/user/send-password-reset-link",
    userData
  );
  toast.success(
    data.message ? data.message : "User data fetched successfully",
    { autoClose: 2000 }
  );
  return data;
});
export const ResetPasswordUser = userTryCatch(async (userData = {}) => {
  const { data } = await axios.post("/api/user/reset-password", userData);
  toast.success(
    data.message ? data.message : "User data fetched successfully",
    { autoClose: 2000 }
  );
  return data;
});

export const logoutUser = userTryCatch(async () => {
  const { data } = await axios.get("/api/user/logout");
  toast.success(data.message ? data.message : "User data fetched successfully");
  return data;
});

export const SendNotificationToAdmin = userTryCatch(async (userData = {}) => {
  const { data } = await axios.post("/api/user/notification", userData);
  toast.success(
    data.message ? data.message : "Notification send successfully");
  return data;
});

export const getCategories = userTryCatchServer(async () => {
  const { data } = await axios.get(process.env.NEXT_PUBLIC_URL+"/api/user/home/categories",
      {
        params:{t: new Date().getDate()}
      });
  return data;
});
export const getProducts = userTryCatchServer(async () => {
  const { data } = await axios.get(process.env.NEXT_PUBLIC_URL+"/api/user/home/products",
      {
        params:{t: new Date().getDate()}
      });
  return data;
});

