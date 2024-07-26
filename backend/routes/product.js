import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { uplodFiles } from "../middleware/multer.js";
import { createProduct } from "../controllers/product.js";


const router = express.Router();

router.post("/product/new",isAuth,uplodFiles,createProduct);

export default router;