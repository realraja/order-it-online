import axios from "axios";
import { toast } from "react-toastify";

const adminTryCatch = (passedFunction) => async (data) => {
  try {
    return await passedFunction(data);
  } catch (error) {
    console.log(error)
    return toast.error(
      error.response?.data.message ? error.response.data.message : error.message
    );
  }
};

export const CheckAuthAdmin = async () => {
  try {
    const { data } = await axios.get(`/api/admin/auth`);
    return data;
  } catch (error) {
    return {success:false,message:error.response?.data.message ? error.response.data.message:error.message,data:error.response?.data.data ? error.response.data.data:null};
  }
};


export const LoginAdmin = adminTryCatch(async (adminData = {}) => {
  const { data } = await axios.post("/api/admin/login", adminData);
  toast.success(
    data.message ? data.message : "admin data fetched successfully",
    { autoClose: 2000 }
  );
  return data;
});

export const logoutAdmin = adminTryCatch(async () => {
  const { data } = await axios.get("/api/admin/logout");
  toast.success(data.message ? data.message : "admin data fetched successfully");
  return data;
});
