import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Users", "Category","Image","Product"],
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


    getImage: builder.query({
      query: () => ({
        url: "/image",
        credentials: "include",
      }),
      providesTags: ["Image"],
    }),
    addImage: builder.mutation({
      query: (data) => ({
        url: "/image",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Image"],
    }),
    updateImage: builder.mutation({
      query: (data) => ({
        url: "/image",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Image"],
    }),
    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/image`,
        method: "DELETE",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["Image"],
    }),


    getProduct: builder.query({
      query: () => ({
        url: "/product",
        credentials: "include",
      }),
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/product",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: "/product",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product`,
        method: "DELETE",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["Product"],
    }),





  }),
});

export const { useGetUserDataQuery, useDeleteUserMutation,

  useGetCategoryQuery,useAddCategoryMutation,useUpdateCategoryMutation,useDeleteCategoryMutation,

  useGetImageQuery,useAddImageMutation,useDeleteImageMutation,useUpdateImageMutation,

  useGetProductQuery,useAddProductMutation,useUpdateProductMutation,useDeleteProductMutation,

  
 } = adminApi;
export default adminApi;
