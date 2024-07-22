import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export const registerUser = async(req,res) =>{
    try {
        const {name , email , password , contact} = req.body;

        //code to check email already exists

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({
                message: "User Email Already Exists",
           });
        }

        //password hashing

        const hashpassword = await bcrypt.hash(password,10);

        //Generate OTP

        const otp = Math.floor(Math.random()* 1000000);

        //create signed activation token 

        const activationToken = jwt.sign({user , otp},process.env.ACTIVATION_SECRET,{
            expiresIn: "5m", 
        });

    } catch (error) {
       res.status(500).json({
            message: error.message,
       });
    }
}