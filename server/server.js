import express from "express";
import connectDB from "./db/connection.js"; // Import the function
import { Server } from "socket.io";
import http from "http"
import setupSocket from "./socket.js"
import cors from "cors"
import cookieParser from "cookie-parser"

// Routers importation
import AuthRouter from "./routes/auth.user.route.js";
import EventRouter from "./routes/event.crud.route.js";
import HomeRouter from "./routes/home.route.js";
import DashBoardRouter from "./routes/dashboard.route.js";
import InterestedRouter from "./routes/events.intrested.route.js";
import LiveEventRouter from "./routes/live.event.route.js";
import NotificationRouter from "./routes/notifications.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3004","http://localhost:3000","http://localhost:3001",process.env.FRONT_END_DOMAIN], // Replace with your frontend URL(s)
    credentials: true, // Allow credentials
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3005","http://localhost:3004","http://localhost:3000",process.env.FRONT_END_DOMAIN], 
    methods: ["GET", "POST"], 
    credentials: true, 
  },
  path : "/socket.io/"
});

setupSocket(io);

app.use("/auth", AuthRouter);
app.use("/event", EventRouter);
app.use("/home", HomeRouter);
app.use('/dashboard',DashBoardRouter);
app.use('/favoured',InterestedRouter);
app.use('/live-event',LiveEventRouter);
app.use('/notifications',NotificationRouter)

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // Connect Database
  connectDB();
  console.log(`🚀 Server running on port ${PORT}`)
});
