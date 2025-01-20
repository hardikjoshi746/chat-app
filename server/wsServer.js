const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/messageModel");
const { User } = require("./models/userModel");

const createWebSocketServer = (server) => {
  const wss = new ws.WebSocketServer({ server });

  // Use a Map to store online users globally
  const onlineUsers = new Map();

  wss.on("connection", (connection, req) => {
    const notifyAboutOnlinePeople = async () => {
      const onlineUsersList = await Promise.all(
        Array.from(onlineUsers.values()).map(async ({ userId, username }) => {
          const user = await User.findById(userId);
          const avatarLink = user ? user.avatarLink : null;

          return {
            userId,
            username,
            avatarLink,
          };
        })
      );

      // Send the list of online users to all connected clients
      [...wss.clients].forEach((client) => {
        client.send(
          JSON.stringify({
            online: onlineUsersList,
          })
        );
      });
    };

    connection.isAlive = true;

    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();

        // Remove the user from onlineUsers and notify others
        onlineUsers.delete(connection.userId);
        notifyAboutOnlinePeople();
        console.log("Connection terminated due to inactivity.");
      }, 1000);
    }, 5000);

    connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

    const cookies = req.headers.cookie;

    if (cookies) {
      const tokenString = cookies
        .split(";")
        .find((str) => str.startsWith("authToken="));

      if (tokenString) {
        const token = tokenString.split("=")[1];
        jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
          if (err) {
            console.log(err);
          } else {
            const { _id, firstName, lastName } = userData;

            // Store user details in the onlineUsers map
            connection.userId = _id;
            connection.username = `${firstName} ${lastName}`;
            onlineUsers.set(_id, {
              userId: _id,
              username: connection.username,
            });

            // Notify all clients about the updated online users
            notifyAboutOnlinePeople();
          }
        });
      }
    }

    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;

      if (recipient && text) {
        const msgDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
        });

        // Send the message to the recipient
        [...wss.clients].forEach((client) => {
          if (client.userId === recipient) {
            client.send(
              JSON.stringify({
                sender: connection.username,
                text,
                id: msgDoc._id,
              })
            );
          }
        });
      }
    });

    // Notify about online users when a new client connects
    notifyAboutOnlinePeople();

    // Log online users to the console
    console.log(
      "Online Users:",
      Array.from(onlineUsers.values()).map((user) => user.username)
    );

    // Handle client disconnection
    connection.on("close", () => {
      onlineUsers.delete(connection.userId);
      notifyAboutOnlinePeople();
      console.log(`${connection.username} disconnected.`);
    });
  });
};

module.exports = createWebSocketServer;
