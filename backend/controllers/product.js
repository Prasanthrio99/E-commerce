import { Product } from "../models/Product.js";
import { rm } from "fs";
//Add new products

export const createProduct = async (req , res ) => {
    try {
        //wheter check user role
        
        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "unauthorized person",
           });
        }

        const {title, description, category, price, stock } = req.body; 
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                message: "Pls select the image",
           });
        }

        // store DB

        const product = await Product.create({
            title,
            description,
            category,
            price,
            stock,
            image:image.path,
        });

        return res.status(201).json({
            message: "Product details added successfully",
            product,
       });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
       });
    }
};

//fetch all products

export const fetchAllProducts = async (req , res ) => {
    try {
        const product = await Product.find();
        return res.status(200).json({
            message: "List of Products ",
            product,
       });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
       });
    }
};

//fetch single products

export const fetchSingleProducts = async (req , res ) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        return res.status(200).json({
            message: "A Products Details",
            product,
       });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
       });
    }
};

//delete products 

export const deleteProduct = async (req , res ) => {
    try {
        //wheter check user role
        
        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "unauthorized person",
           });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(403).json({
                message: "Product Not Found",
           });
        }

        rm(product.image, () => {
            console.log("Image Deleted...>");
        });
        await product.deleteOne();
        return res.json({
            message: "Products Detail Deleted Successfully" ,
       });
    }catch(error){
        return res.status(500).json({
            message: error.message,
       });
    }
}