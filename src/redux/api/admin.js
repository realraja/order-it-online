import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: ["Users", "Category", "Image", "Product","Dashbord","Order"],
  endpoints: (builder) => ({
    getDashbordData: builder.query({
      query: () => ({
        url: "/dashbord",
        credentials: "include",
      }),
      providesTags: ["Dashbord"],
    }),

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
      invalidatesTags: ["Users","Dashbord"],
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
      invalidatesTags: ["Category","Dashbord"],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Category","Dashbord"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category`,
        method: "DELETE",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["Category","Dashbord"],
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
      invalidatesTags: ["Image","Dashbord"],
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
      invalidatesTags: ["Image","Dashbord"],
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
      invalidatesTags: ["Product","Dashbord"],
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
      invalidatesTags: ["Product","Dashbord"],
    }),



    getOrder: builder.query({
      query: () => ({
        url: "/order",
        credentials: "include",
      }),
      providesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: "/order",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order`,
        method: "DELETE",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["Order","Dashbord"],
    }),
  }),
});

export const {
  useGetDashbordDataQuery,


  
  useGetUserDataQuery,
  useDeleteUserMutation,

  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  useGetImageQuery,
  useAddImageMutation,
  useDeleteImageMutation,
  useUpdateImageMutation,

  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,


  useGetOrderQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = adminApi;
export default adminApi;
