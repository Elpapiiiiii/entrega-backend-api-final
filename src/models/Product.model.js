import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
  stock: Number,
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);