const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      default: 'user',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const Notification =
  mongoose.models.Notification || mongoose.model("Notification", schema);

export default Notification;
