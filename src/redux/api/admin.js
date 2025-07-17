import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Users", "Category"],
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

    getCategory: builder.query({
      query: () => ({
        url: "/category",
        credentials: "include",
      }),
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category`,
        method: "DELETE",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["Category"],
    }),





  }),
});

export const { useGetUserDataQuery, useDeleteUserMutation,

  useGetCategoryQuery,useAddCategoryMutation,useUpdateCategoryMutation,useDeleteCategoryMutation,

  
 } = adminApi;
export default adminApi;
