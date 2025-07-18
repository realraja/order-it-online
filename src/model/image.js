const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "image name is required"],
    },
    url: {type:String,require:true},
    pin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const Image = mongoose.models.Image || mongoose.model("Image", schema);

export default Image;
