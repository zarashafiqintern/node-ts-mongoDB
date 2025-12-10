import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateJWT from "../middlewares/authenticateJWT";
import User, { IUser } from "../models/user";

const router = express.Router();

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Empty Body not allowed" });
  }
  next();
};

router.post("/userSignup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  
  await newUser.save();

  return res.status(201).send({
    message: "User Signup Successfully",
    data: { id: newUser._id,
         name: newUser.name,
         email: newUser.email }
  });
});

router.post("/userLogin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) return res.status(401).send({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) return res.status(401).send({ message: "Invalid password" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).send({ message: "JWT_SECRET is not defined" });

  const token = jwt.sign({ 
    id: existingUser._id,
     email: existingUser.email
     }, secret, {
     expiresIn: "1d" });

  return res.status(200).send({ message: "Login successful", token });
});

router.put("/user/:id", validateUser, async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedUser) return res.status(404).send("User not found");
  return res.json(updatedUser);
});

router.delete("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return res.status(404).send("ID not found");
  return res.json({ status: "Deleted Successfully" });
});

router.get("/product", authenticateJWT, (req: any, res: Response) => {
  res.send({ message: `Hello ${req.user.email}, you can access this protected route!` });
});

export default router;
