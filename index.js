const express=require("express");
const mongoose=require("mongoose");
const app=express();
const http=require("http");
const jwt=require("jsonwebtoken")

const {Server}=require("socket.io");
const server=http.createServer(app);
const io= new Server(server);

require("dotenv").config(".env")
const url=process.env.url
app.use(express.json())
const userRoute=require("./route/userRoute")
const {socketVerify}=require("./middleware/authMiddleware");
const msgSchema=require("./model/msgSchema")


app.use("/api",userRoute);

io.use(socketVerify)

io.on("connection", (socket)=>{
    console.log(`${socket.user.username} is connected`)
socket.on("send_msg",async(msg)=>{
const newMsg= new msgSchema({
    text: msg.text,
   senderId:socket.user._id,
});

await newMsg.save()
    io.except(socket.id).emit("receive_msg",newMsg)

})

})



mongoose.connect(url).then(()=>{
    console.log("Connected To MongoDB")
}).catch((err)=>{
    console.log("Can't connect to mongoDB",err)
})

server.listen(3000,()=>{
    console.log("The server is running on port 3000")
})