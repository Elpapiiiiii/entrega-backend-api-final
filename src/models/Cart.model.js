import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
      },
      quantity: Number
    }
  ]
});

export default mongoose.model("Carts", cartSchema);