const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema({
 user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Cart must belong to a user'],
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Cart item must reference a product']
      },
      quantity: {
        type: Number,
        required: [true, 'Cart item must have a quantity'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
},
  {
    timestamps: true,
  }
);

// Prevent duplicate model registration in hot reload
const Cart = mongoose.models.Cart || mongoose.model("Cart", schema);

export default Cart;
