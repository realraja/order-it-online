import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
  name: "auth",
  initialState: {
    isUser: false,
    userId: null,
    userData: {},
    loading: true,
    isAdmin: false,
    isLoginDialog: false,
    cart: [], // [{ product, quantity }]
    wishlist: [],
    addresses: [],
  },
  reducers: {
    login: (state, action) => {
      state.isUser = true;
      state.userId = action.payload._id;
      state.userData = action.payload;
      state.cart = action.payload?.cart || [];
      state.wishlist = action.payload?.wishlist || [];
      state.loading = false;
      state.addresses = action.payload?.addresses || [];
    },

    logout: (state) => {
      state.isUser = false;
      state.userId = null;
      state.userData = {};
      state.cart = [];
      state.wishlist = [];
      state.loading = false;
      state.addresses = [];
    },

    setIsLoginDialog: (state, action) => {
      state.isLoginDialog = action.payload;
    },

    // Toggle item in wishlist
    toggleWishlistItem: (state, action) => {
      const productId = action.payload;
      const index = state.wishlist.findIndex(id => id === productId);
      if (index !== -1) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(productId);
      }
    },

    // Add or increase quantity
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    clearCart: (state, action) => {
      state.cart = [];
    },
    setToCart: (state, action) => {
      state.cart = action.payload;
    },
    

    // Remove item from cart entirely
    deleteFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter(item => item.product._id !== id);
    },

    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const {
  login,
  logout,
  setIsLoginDialog,
  toggleWishlistItem,
  addToCart,
  decreaseCartItem,
  deleteFromCart,
  setAddresses,
  setToCart,
clearCart
} = authSlicer.actions;

export default authSlicer;
