import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

//middleware 
app.use(express.json());


//import routes

import userRoutes from "./routes/user.js"

//using routes
app.use("/api",userRoutes);

app.get("/",(req,res)=>{
    res.send("<h1>Hello world</h1>");
});

app.listen(port ,() => {
    console.log(`Server Run ${port}`);
    connectDB();
});