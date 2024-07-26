import mongoose from "mongoose";

/* ----user datas-----
        Name
        Email
        Password
        Role
        Contact
 */

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin",
    },
    contact: {
        type: String,
        required: true,
    },
},
{
    timestamps: true, 
});

export const User = mongoose.model("User",schema);


