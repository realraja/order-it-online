const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    images:[String],
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const Review = mongoose.models.Review || mongoose.model("Review", schema);

export default Review;
