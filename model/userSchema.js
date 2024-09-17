const mongoose=require("mongoose");


const user=mongoose.Schema({
email:{
    type:String,
    require:true
},
username:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
confirmPassword: String
})

const userSchema= mongoose.model("user",user);

module.exports= userSchema;