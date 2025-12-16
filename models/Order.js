const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: { type: String, ref: 'Products' },
        name: String,
        quantity: Number,
        price: Number,
      }
    ],
    totalQuantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    shippingFee: { 
        type: Number, 
        default: 0 
    },
    discountAmount: { 
        type: Number, 
        default: 0 
    },

    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    deliveryLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "shipping", "arrived", "delivered", "cancelled"]
    },
    shipperId: {
      type: String,
      default: null,
    },
  }, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
  
);

OrderSchema.virtual('shipperInfo', {
  ref: 'User',
  localField: 'shipperId',
  foreignField: 'userID',
  justOne: true
});

module.exports = mongoose.model("Order", OrderSchema);
