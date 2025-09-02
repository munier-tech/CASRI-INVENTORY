import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true, // fetched from Product.price at sale time
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sale", saleSchema);

export default Sales
