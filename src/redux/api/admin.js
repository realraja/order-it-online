import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUserData: builder.query({
      query: () => ({
        url: "/users",
        credentials: "include",
      }),
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
        
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUserDataQuery ,useDeleteUserMutation} = adminApi;
export default adminApi;

// deleteImportantEvent: builder.mutation({
//   query: (data) => ({
//     url: "/important-event",
//     method: "DELETE",
//     credentials: "include",
//     body: data,
//   }),
//   invalidatesTags: ["Users"],
// }),
// updateProfile: builder.mutation({
//   query: (data) => ({
//     url: "/update-profile",
//     method: "PUT",
//     credentials: "include",
//     body: data,
//   }),
//   invalidatesTags: ["Users"],
// }),
