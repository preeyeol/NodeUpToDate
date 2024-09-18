const mongoose=require("mongoose");


const room=mongoose.Schema({
roomId:{
    type:String,
    unique:true
},
name:String,
userId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}]
})

const roomSchema= mongoose.model("room",room);

module.exports= roomSchema;