const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price must be at least 0"],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    brand: String,
    quantity: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [String],
    imageCover: String,

    // Variant handling
    isChildProduct: {
      type: Boolean,
      default: false,
    },
    isVariants: {
      type: Boolean,
      default: false,
    },
    isVariantImage: {
      type: Boolean,
      default: false,
    },
    variantType: {
      type: String, // e.g. 'color', 'size'
    },
    variantName: {
      type: String, // e.g. 'Red', 'XL'
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // referencing other product variants
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
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

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
