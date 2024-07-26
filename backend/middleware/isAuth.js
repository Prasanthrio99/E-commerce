import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.token;
        if (!token) {
            return res.status(403).json({
                 message: "Please login to access"
                 });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user info from the db
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(403).json({ 
                message: "User not found" 
            });
        }

        // Attach user information to the request object
        req.user = user;
        next();
    } catch (error) {
        
        return res.status(403).json({ 
            message: "Invalid or expired token" 
        });
    }
};
