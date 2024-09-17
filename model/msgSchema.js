const mongoose=require("mongoose");


const msg=mongoose.Schema({
text:{
    type:String,

},
senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},
createdAt:{
    type: Date,
    default: new Date()
}
})

const msgSchema= mongoose.model("msg",msg);

module.exports= msgSchema;