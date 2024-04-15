import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required: true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    profilePic:{
        type:String,
        default: "https://avatar.iran.liara.run/public/boy?username=jacky123",
    },

}, {timestamps: true});

const User = mongoose.model("User" , userSchema);
export default User;