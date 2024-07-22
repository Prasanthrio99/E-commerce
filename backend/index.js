import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;

app.get("/",(req,res)=>{
    res.send("<h1>Hello world</h1>");
});

app.listen(port ,() => {
    console.log("Server Run");
});