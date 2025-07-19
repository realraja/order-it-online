import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicer/auth";
import miscSlicer from "./slicer/misc";
import adminSlicer from "./slicer/admin";
import adminApi from "./api/admin";
import userApi from "./api/user";
// import chatSlicer from "./slicer/chat";
// import api from "./api/api";


const store = configureStore({
    reducer: {
        [authSlicer.name] : authSlicer.reducer,
        [miscSlicer.name] : miscSlicer.reducer,
        [adminSlicer.name] : adminSlicer.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(adminApi.middleware,userApi.middleware),
})

export default store; 