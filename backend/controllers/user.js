import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import sendMail from "../middleware/sendMail.js";


//New user Registration

export const registerUser = async(req,res) => {
    try {
        //console.log(req.body);
        const {name , email , password , contact} = req.body;

        //code to check email already exists

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({
                message: "User Email Already Exists",
           });
        }

        //password hashing

        const hashPassword = await bcrypt.hash(password,10);

        //Generate OTP

        const otp = Math.floor(Math.random()* 1000000);

        //create new user data

        user = {name,email,hashPassword,contact};

        // Save the new user in the database

        //await user.save();

        //create signed activation token 

        const activationToken = jwt.sign({user , otp},process.env.ACTIVATION_SECRET,{
            expiresIn: "5m", 
        });

        //send mail to user
        const message = `please verify your account using OTP - your OTP is ${otp}`;
        await sendMail(email,"Welcome our shopping cart zone",message);

        res.status(200).json({
            message: "OTP send your mail pls check",
            activationToken,
       });

    } catch (error) {
       res.status(500).json({
            message: error.message,
       });
    }
};

//verify OTP

export const verifyUser = async(req,res) => {
    try {
        const {otp , activationToken} = req.body;
        const verify = jwt.verify(activationToken,process.env.ACTIVATION_SECRET);
        if (!verify) {
            return res.json({
                message:"OTP Expired",
            });
        }

        if (verify.otp !== otp) {
            return res.json({
                message:"Wrong  OTP",
            });
        }

        await User.create({
            name:verify.user.name,
            email:verify.user.email,
            password:verify.user.hashPassword,
            contact:verify.user.contact,
        });

        res.status(200).json({
            message: "User Registration Success",
       });

    } catch (error) {
        res.status(500).json({
            message: error.message,
       });
    }
};