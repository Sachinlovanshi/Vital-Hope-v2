import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";

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

app.get("/", (req, res) => {
  res.send("Vital Hope API Running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
