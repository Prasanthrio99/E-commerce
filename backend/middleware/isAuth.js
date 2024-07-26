import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async(req , res , next) => {
    try {
       const token =req.headers.token;
       if (!token) {
        return res.status(403).json({message:"pls Login to access"}); 
       } 
       //decode jwt
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req._id = await User.findById(decoded._id);
        next();
    } catch (error) {
       return res.status(403).json({message:"pls Login to access"}); 
    }
};
