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
const roomSchema=require("./model/roomSchema");
const userSchema = require("./model/userSchema");


app.use("/api",userRoute);

io.use(socketVerify)

io.on("connection", (socket)=>{
    console.log(`${socket.user.username} is connected`)

    const errorHandler= (err)=>{
        socket.emit("error",{
            message:err.msg|| "Invalid Message",
            status:err.statusCode ||400
        })

    }

    socket.on("createRoom",async ({userId})=>{

        
        const userRoom = await roomSchema.findById(userId);
        if(!roomSchema[userRoom]){
            userSchema[userRoom]=[]
            
        }
        console.log(userRoom)
        socket.join(roomID)
        io.emit("newRoom", `You created a room${roomID} `)
    })

socket.on("joinRoom",async ({roomID})=>{


    // roomId exist xa ki nai check garne 
  

    // User tyo room ma xa ki nai check garne through room data base 
    // raixa vane  socket.join(roomID)
    // xaina vane == memberID.push(socket.user._id)==> socket.join(roomID)==>

    // If not ==> roomiD rainxa vane ==> error message create a room ==> jo create tyo automatic room ma add huna paryo 

    // create_room 
    // pahila roomId exist xa ki nai check garna paryo 
    // already raixa vane simple ==> room already exist Join room 
    // create a room ==> roomid;
    // memberId.push(socket.user._id)
    // you created a room 




 io.to(roomID).emit("userRoom",`${socket.user.username} has joined the room${roomID}`)

})

socket.on("send_msg",async(msg)=>{
    if(!msg.text){
        return errorHandler({
            message:"Internal error",
            statusCode: 403
        })
    }

    if(!msg.roomID){
        return errorHandler({
            message:"Internal error",
            statusCode: 403
        })
    }
const newMsg= new msgSchema({
    text: msg.text,
    roomID:msg.roomID,
   senderId:socket.user._id,
});

await newMsg.save()
    io.except(socket.id).to(msg.roomID).emit("receive_msg",newMsg)

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