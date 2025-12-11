import express from "express";
import dotenv from "dotenv";
import userRoutes from "./src/routes/users";
import productRoutes from "./src/routes/product";
import connectDB from "./src/config/db";

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

app.use("/", userRoutes);
app.use('/', productRoutes);

app.listen(6000, () => 
console.log("Server started"));
