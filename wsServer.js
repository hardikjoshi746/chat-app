const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/messageModel");
const { User } = require("./models/userModel");

const createWebSocketServer = (server) => {
  const wss = new ws.WebSocketServer({ server });

  wss.on("connection", (connection, req) => {
    // Notify about online users
    const notifyAboutOnlinePeople = async () => {
      const onlineUsers = await Promise.all(
        Array.from(wss.clients).map(async (client) => {
          const { userId, username } = client;
          if (!userId) return null;

          const user = await User.findById(userId).catch(() => null);
          const avatarLink = user ? user.avatarLink : null;
          return { userId, username, avatarLink };
        })
      );

      // Filter out null values from onlineUsers
      const filteredOnlineUsers = onlineUsers.filter((user) => user !== null);

      [...wss.clients].forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(
            JSON.stringify({
              online: filteredOnlineUsers,
            })
          );
        }
      });
    };

    // Handle connection health check
    connection.isAlive = true;
    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyAboutOnlinePeople();
        console.log("Connection terminated due to inactivity.");
      }, 1000);
    }, 5000);

    connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

    // Extract and verify token
    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenString = cookies
        .split(";")
        .find((str) => str.trim().startsWith("authToken="));
      if (tokenString) {
        const token = tokenString.split("=")[1];
        jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
          if (err) {
            console.error("JWT verification error:", err);
          } else {
            const { _id, firstName, lastName } = userData;
            connection.userId = _id;
            connection.username = `${firstName} ${lastName}`;
          }
        });
      }
    }

    // Handle incoming messages
    connection.on("message", async (message) => {
      try {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;

        if (!recipient || !text) return;

        const msgDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
        });

        [...wss.clients].forEach((client) => {
          if (client.userId === recipient && client.readyState === ws.OPEN) {
            client.send(
              JSON.stringify({
                sender: connection.username,
                text,
                id: msgDoc._id,
              })
            );
          }
        });
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // Notify about online users when a new connection is established
    notifyAboutOnlinePeople();
  });
};

module.exports = createWebSocketServer;
