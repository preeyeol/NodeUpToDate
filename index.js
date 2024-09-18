const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const jwt = require("jsonwebtoken");

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

require("dotenv").config(".env");
const url = process.env.url;
app.use(express.json());
const userRoute = require("./route/userRoute");
const { socketVerify } = require("./middleware/authMiddleware");
const msgSchema = require("./model/msgSchema");
const roomSchema = require("./model/roomSchema");
const userSchema = require("./model/userSchema");

app.use("/api", userRoute);

io.use(socketVerify);

io.on("connection", (socket) => {
  console.log(`${socket.user.username} is connected`);

  const errorHandler = (err) => {
    socket.emit("error", {
      message: err.msg || "Invalid Message",
      status: err.statusCode || 400,
    });
  };

  socket.on("createRoom", async ({ roomId }) => {

    const rooms = await roomSchema.findOne({roomId:roomId});

    if (!rooms) {
   const newRoom= new roomSchema({
    roomId:roomId,
    userId:[socket.user._id],
      })
      await newRoom.save();
      console.log(newRoom)
      socket.join(newRoom.roomId);
      socket.emit("room_join",`Room created successfully`);
      return
    }

    
    if(!rooms.userId.includes(socket.user._id)){
        rooms.userId.push(socket.user._id);
        await rooms.save()
    }
    
    socket.join(rooms.roomId);
    
    if(rooms.userId.includes(socket.user._id)){
        socket.emit("room_join",`You are already in the room`);
      return
    }
    socket.broadcast
    .to(rooms.roomId)
    .emit("user_added", `${socket.user.username} has joined the room`);
    socket.emit("room_join", "You joined the room");
  });

  socket.on("send_msg", async ({text,roomId}) => {
    if (!text) {
      return errorHandler({
        message: "Message text is required",
        statusCode: 400,
      });
    }

    const room =await roomSchema.findOne({roomId:roomId})

    if (!room) {
        return errorHandler({
          msg: "Room not found",
          statusCode: 404,
        });
      }
      

      if (!room.userId.includes(socket.user._id)) {
        return errorHandler({
          msg: "You are not a member of this room",
        });
      }
    const newMsg = new msgSchema({
      text: text,
      roomId: room._id,
      senderId: socket.user._id,
    });

    await newMsg.save();
    io.except(socket.id).to(String(roomId)).emit("receive_msg", {
        text: text,
        username: socket.user.username,
        createdAt: newMsg.createdAt,
      });
  });
});

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => {
    console.log("Can't connect to mongoDB", err);
  });

server.listen(3000, () => {
  console.log("The server is running on port 3000");
});
