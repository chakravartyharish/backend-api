const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const sanitizeHTML = require("sanitize-html");
const jwt = require("jsonwebtoken");

// CORS configuration
const corsOptions = {
  origin: "*", // Specify your frontend's URL
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions)); // Apply CORS to all routes

app.options('*', cors(corsOptions)); // Handle preflight requests for all routes


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", require("./router"));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  pingTimeout: 30000,
  cors: {
    origin: "*", // Allow CORS for Socket.IO as well
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  socket.on("chatFromBrowser", function (data) {
    try {
      let user = jwt.verify(data.token, process.env.JWTSECRET);
      socket.broadcast.emit("chatFromServer", {
        message: sanitizeHTML(data.message, { allowedTags: [], allowedAttributes: {} }),
        username: user.username,
        avatar: user.avatar,
      });
    } catch (e) {
      console.log("Not a valid token for chat.");
    }
  });
});

module.exports = server;



// const express = require("express")
// const app = express()
// const sanitizeHTML = require("sanitize-html")
// const jwt = require("jsonwebtoken")

// app.use(express.urlencoded({ extended: false }))
// app.use(express.json())

// app.use("/", require("./router"))

// const server = require("http").createServer(app)
// const io = require("socket.io")(server, {
//   pingTimeout: 30000,
//   cors: true
// })

// io.on("connection", function(socket) {
//   socket.on("chatFromBrowser", function(data) {
//     try {
//       let user = jwt.verify(data.token, process.env.JWTSECRET)
//       socket.broadcast.emit("chatFromServer", { message: sanitizeHTML(data.message, { allowedTags: [], allowedAttributes: {} }), username: user.username, avatar: user.avatar })
//     } catch (e) {
//       console.log("Not a valid token for chat.")
//     }
//   })
// })

// module.exports = server


