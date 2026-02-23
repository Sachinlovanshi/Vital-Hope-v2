import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";



dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/consultations", consultationRoutes);

app.get("/", (req, res) => {
  res.send("Vital Hope API Running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
// Handle WebRTC signaling events
   socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("iceCandidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("iceCandidate", candidate);
  });
//upto here

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
  });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// export { io };
