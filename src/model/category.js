const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name already exist"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: String,
    image: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const Category = mongoose.models.Category || mongoose.model("Category", schema);

export default Category;
