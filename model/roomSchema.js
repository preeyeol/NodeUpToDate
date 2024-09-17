const mongoose=require("mongoose");


const room=mongoose.Schema({
text:{
    type:String,
    require:true
},
senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}
})

const roomSchema= mongoose.model("room",room);

module.exports= roomSchema;