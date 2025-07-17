const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    imgUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dwc3gwskl/image/upload/v1721379013/samples/ecommerce/fiiijyy4cq1nrcp7t4zz.jpg",
      required: true,
    },
    phone: { type: Number },
    dob: { type: Date },
    addresses: [
      {
        phone: Number,
        name:String,
        landmark: String,
        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
        zipCode: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    // Tokens
    token1: { type: String },
    token2: { type: String },
    passwordResetToken: { type: String, select: false },
    passwordResetTokenExp: { type: Date, select: false },

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const User = mongoose.models.User || mongoose.model("User", schema);

export default User;
