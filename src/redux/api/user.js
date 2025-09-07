import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/user" }),
  tagTypes: ["Category", "Product", "Wishlist","Cart","Address","Order","Review"],
  endpoints: (builder) => ({
    getUserCategory: builder.query({
      query: () => ({
        url: "/home/categories",
        credentials: "include",
      }),
      providesTags: ["Category"],
    }),

    getUserProduct: builder.query({
      query: () => ({
        url: "/home/products",
        credentials: "include",
      }),
      providesTags: ["Product","Review"],
    }),

    getUserProductByCategory: builder.query({
      query: (slug) => ({
        url: `/category/${slug}`,
        credentials: "include",
      }),
      providesTags: ["Product", "Category","Review"],
    }),

    getUserAllProductByPageAndLimit: builder.query({
      query: ({ page, limit }) => ({
        url: `/products/?page=${page}&limit=${limit}`,
        credentials: "include",
      }),
      providesTags: ["Product","Review"],
    }),

    getUserAllProductBySearch: builder.query({
      query: (query) => ({
        url: `/products/${query}`,
        credentials: "include",
      }),
      providesTags: ["Product","Review"],
    }),

    getUserProductBySlug: builder.query({
      query: (slug) => ({
        url: `/product/${slug}`,
        credentials: "include",
      }),
      providesTags: ["Product","Review"],
    }),


    getWishlist: builder.query({
      query: () => ({
        url: "/wishlist",
        credentials: "include",
      }),
      providesTags: ["Wishlist","Review"],
    }),
    toggleWishlist: builder.mutation({
      query: (data) => ({
        url: "/wishlist",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),


    addRemoveFromCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    DeleteFromCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "DELETE",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),


    addAddress: builder.mutation({
      query: (data) => ({
        url: "/address",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    UpdateAddress: builder.mutation({
      query: (data) => ({
        url: "/address",
        method: "PATCH",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    DeleteAddress: builder.mutation({
      query: (data) => ({
        url: "/address",
        method: "DELETE",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),


    getOrders: builder.query({
      query: () => ({
        url: "/order",
        credentials: "include",
      }),
      providesTags: ["Order","Review"],
    }),
    PlaceOrder: builder.mutation({
      query: (data) => ({
        url: "/order",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    cancelOrder: builder.mutation({
      query: (data) => ({
        url: "/order",
        method: "DELETE",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),


    addReview: builder.mutation({
      query: (data) => ({
        url: "/review",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),


    getNotifications: builder.query({
      query: () => ({
        url: "/notification",
        credentials: "include",
      }),
      providesTags: [],
    }),
  }),
});

export const {
  useGetUserCategoryQuery,
  useGetUserProductQuery,
  useGetUserProductByCategoryQuery,
  useGetUserAllProductByPageAndLimitQuery,
  useLazyGetUserAllProductBySearchQuery,
  useGetUserAllProductBySearchQuery,
  useGetUserProductBySlugQuery,


  useGetWishlistQuery,
  useToggleWishlistMutation,
  useAddRemoveFromCartMutation,
  useDeleteFromCartMutation,



  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,

  
  useGetOrdersQuery,
  usePlaceOrderMutation,
  useCancelOrderMutation,

  useAddReviewMutation,

  useGetNotificationsQuery,

  util:{getRunningQueriesThunk }
} = userApi;
export default userApi;


export const { getUserCategory } = userApi.endpoints;