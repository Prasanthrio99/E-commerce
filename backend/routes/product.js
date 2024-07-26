import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { uplodFiles } from "../middleware/multer.js";
import { createProduct, deleteProduct, fetchAllProducts, fetchSingleProducts, updateStock } from "../controllers/product.js";


const router = express.Router();

router.post("/product/new",isAuth,uplodFiles,createProduct);
router.get("/product/all-products",fetchAllProducts);
router.get("/product/single/:id",fetchSingleProducts);
router.delete("/product/:id",isAuth,deleteProduct);
router.put("/product/:id",isAuth,updateStock);

export default router;