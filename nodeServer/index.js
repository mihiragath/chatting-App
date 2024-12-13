const io = require("socket.io")(8000, {
  cors: {
    origin: "http://127.0.0.1:5500", // Replace with your frontend's origin
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  // New user joined
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // User sends a message
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});
