const express=require("express");
const userRoute=express.Router();
const {signup,login}=require("../controller/userController");
const verifyToken=require("../middleware/authMiddleware")

userRoute.post("/signup",signup);
userRoute.post("/login",login)


module.exports=userRoute