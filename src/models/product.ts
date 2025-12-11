// import mongoose from "mongoose";

// export interface IProduct {
//   save(): unknown;
//   name: string;
//   userId: string;
// }

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     userId: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model<IProduct>("Product", productSchema);

// export default Product;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
