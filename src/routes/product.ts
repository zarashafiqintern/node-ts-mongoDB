import express, { Request, Response } from "express";
import authenticateJWT from "../middlewares/authenticateJWT";
import Product from "../models/product";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

router.post('/addProduct', authenticateJWT, async (req: AuthRequest, res: Response) => {
  let { name } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Product name is required" });
  }

  const namesArray = Array.isArray(name) ? name : [name];

  const newProducts = await Product.insertMany(
    namesArray.map((productName: string) => ({
      name:productName,
      userId: req.user!.id
    }))
  );

  res.status(201).send({
    message: "Product(s) added successfully",
    products: newProducts
  });
});

router.get('/products/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
const userProducts = await Product.find({ userId: String(userId) });
  res.status(200).json(userProducts);
});

router.get('/products', async (req: Request, res: Response) => {
  const allProducts = await Product.find();
  res.status(200).json(allProducts);
});

router.delete('/products/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await Product.deleteMany({ userId: String(userId) });

if ((result.deletedCount ?? 0) === 0) {
  return res.status(404).send({ message: "No products found for this user" });
}

  res.status(200).send({ message: "deleted successfully" });
});

router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { name } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { name },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(404).send({ message: "Product not found" });
  }

  res.send({
    message: "Product updated successfully",
    product: updatedProduct
  });
});

export default router;
