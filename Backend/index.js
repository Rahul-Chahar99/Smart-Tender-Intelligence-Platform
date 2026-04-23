import "dotenv/config.js";
import http from "http";
import { Server } from "socket.io";

import { app } from "./app.js";
import connectDb from "./Config/database.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Socket.io Setup ---
const server = http.createServer(app);

const allowedOrigin =
  process.env.CORS_ORIGIN ||
  (process.env.NODE_ENV === "production"
    ? "https://smart-tender-intelligence-platform.vercel.app"
    : "http://localhost:5173");

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected via WebSocket:", socket.id);

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      if (userData.role === "admin") {
        socket.join("admin_room");
      }
      console.log(
        `User ${userData.fullName || userData._id} joined their rooms`,
      );
    }
  });
});
// -----------------------

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDb();
  isConnected = true;
};

// For Vercel serverless
if (process.env.VERCEL) {
  connectToDatabase();
} else {
  connectDb()
    .then(() => {
      server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT || 8000}`);
      });
    })
    .catch((err) => {
      console.log("mongoDB connection fail", err);
    });
}

export default app;
