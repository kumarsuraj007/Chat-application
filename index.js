import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import formatMessages from "./utils/messages.js";
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from "./utils/users.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const botName = "chatCord-Bot";

// Set static folder
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

// Run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    io.emit("message", formatMessages(botName, "Welcome to chatCord!"));

    // Run when user connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessages(botName, `${user.username} has joined the chat!`)
      );
      //   Send users and room info 
io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
})
  });

  // Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit("message", formatMessages(user.username, msg));
  });

  // Run when user disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if(user) {
        io.to(user.room).emit(
            "message",
            formatMessages(botName, `${user.username} has left the chat!`)
          );

                //   Send users and room info 
io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
})
    }
   
  });
});

const port = 3000 || process.env.PORT;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
