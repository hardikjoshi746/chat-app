require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const createWebSocketServer = require("./wsServer.js");
const connection = require("./db/db.js");
const userRoute = require("./routes/userRoute.js");
const avatarRoute = require("./routes/avatarRoute.js");

const app = express();

// Database connection
connection();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4000",
  "https://swifty-chatty-appy.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
  credentials: true, // Allow credentials like cookies
};

app.use(cors(corsOptions));

// Routes
app.use("/api/user", userRoute);
app.use("/api/avatar", avatarRoute);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "frontend", "dist", "index.html"),
    (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error loading frontend");
      }
    }
  );
});

// Start server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});

// WebSocket server
createWebSocketServer(server);
