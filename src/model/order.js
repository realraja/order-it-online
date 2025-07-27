const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    item: {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Order item must reference a product"],
        },
        quantity: {
          type: Number,
          required: [true, "Order item must have a quantity"],
          min: [1, "Quantity must be at least 1"],
        }
      },
    review:{
      type: mongoose.Schema.ObjectId,
      ref: "Review",
    },
    
    shippingAddress: {
      name:String,
      phone:String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["card", "upi", "cod"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      transactionOrderId: String,
      transactionPaymentId: String,
      amountPaid: Number,
      paymentDate: {
      type: Date,
      default: Date.now,
    },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be at least 0"],
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    trackingNumber: String,
    trackingUrl: String,
    coupon: {
      type: mongoose.Schema.ObjectId,
      ref: "Coupon",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const Order = mongoose.models.Order || mongoose.model("Order", schema);

export default Order;
