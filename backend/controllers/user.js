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
           return res.status(400).json({
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

        return res.status(200).json({
            message: "OTP send your mail pls check",
            activationToken,
       });

    } catch (error) {
        return res.status(500).json({
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

        return res.status(200).json({
            message: "User Registration Success",
       });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
       });
    }
};

//Login user

export const loginUser = async(req,res) => {
    try {
        const {email ,password}=req.body;

        //check user email address

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials",
           });   
        }
        //check password

        const matchPassword = await bcrypt.compare(password,user.password);

        if (!matchPassword) {
            return res.status(400).json({
                message: "Invalid Credentials",
           });   
        }

        //exculde the password feild before sending ---hidden of client side---

        const {password:userPassword,...userDetails} = user.toObject();

        //generate signed token

         const token = jwt.sign({_id:user.id},process.env.JWT_SECRET,{expiresIn:"15d"});

         return res.status(200).json({
            message: "Welcome " + user.name,
            token,
            user:userDetails,
       }); 
    } catch (error) {
        return res.status(500).json({
            message: error.message,
       }); 
    }
};

//user profile 

export const myProfile = async(req,res) => {
    try {
       const user = await User.findById(req.user).select("-password");
       return res.status(200).json({
        user,
   });  
    } catch (error) {
        return res.status(500).json({
            message: error.message,
       }); 
    }
};
