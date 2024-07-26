import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ message: "Please login to access" });
        }

        // Extract the token from "Bearer <token>"
        const token = authHeader;
        if (!token) {
            return res.status(403).json({ message: "Token missing" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user information from the database
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }
        
        //req._id = await User.findById(decoded._id);
        
        // Attach user information to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error); // Debugging statement
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
