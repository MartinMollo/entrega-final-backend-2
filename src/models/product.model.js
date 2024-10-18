import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    thumbnails: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
