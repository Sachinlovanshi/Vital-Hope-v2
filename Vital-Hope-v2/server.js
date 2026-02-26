import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import User from "./models/User.js";

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

/* =========================================
   WebRTC Room Management
========================================= */

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* =========================
     Register User Socket
  ========================= */

  socket.on("registerSocket", async ({ userId }) => {
    try {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id
      });
    } catch (err) {
      console.error("Socket registration error:", err);
    }
  });

  /* =========================
     Join Room
  ========================= */

  socket.on("joinRoom", ({ roomId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    // Prevent duplicate joins
    if (!rooms[roomId].includes(socket.id)) {
      rooms[roomId].push(socket.id);
    }

    socket.join(roomId);

    console.log("Room:", roomId, "Members:", rooms[roomId]);

    // When exactly 2 users join → notify first user to create offer
    if (rooms[roomId].length === 2) {
      const [firstUser] = rooms[roomId];

      console.log(
        "Both users joined. Emitting readyToCall to:",
        firstUser
      );

      io.to(firstUser).emit("readyToCall");
    }
  });

  /* =========================
     Signaling Events
  ========================= */

  socket.on("offer", ({ roomId, offer }) => {
    console.log("Offer forwarded to room:", roomId);
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    console.log("Answer forwarded to room:", roomId);
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("iceCandidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("iceCandidate", candidate);
  });

  /* =========================
     Disconnect Handling
  ========================= */

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    // Remove from WebRTC rooms
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        id => id !== socket.id
      );

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }

    // Reset expert availability safely
    try {
      await User.findOneAndUpdate(
        { socketId: socket.id },
        {
          socketId: null,
          isAvailable: true
        }
      );
    } catch (err) {
      console.error("Disconnect DB update error:", err);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

export { io };
