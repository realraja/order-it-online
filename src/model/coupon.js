const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: [true, "Discount type is required"],
      enum: ["percentage", "fixed_amount"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value must be at least 0"],
    },
    minOrderAmount: {
      type: Number,
      min: [0, "Minimum order amount must be at least 0"],
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, "Maximum discount amount must be at least 0"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (val) {
          return val > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    maxUses: {
      type: Number,
      min: [1, "Maximum uses must be at least 1"],
    },
    currentUses: {
      type: Number,
      default: 0,
      min: [0, "Current uses cannot be negative"],
    },
    usersUsed: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    //   products: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: 'Product'
    //     }
    //   ],
    //   categories: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: 'Category'
    //     }
    //   ],
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
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
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", schema);

export default Coupon;
