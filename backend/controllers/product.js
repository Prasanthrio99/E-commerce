import { Product } from "../models/Product.js";



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
