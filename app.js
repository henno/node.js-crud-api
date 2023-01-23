require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//rate limiter
const limitLoginRequestsCount = rateLimit({
  max: 5,
  windowMs: 2 * 60 * 1000,
  handler: function (req, res) {
    return res.status(429).send("Too many requests");
  },
});

const limitCRUDRequestsCount = rateLimit({
  max: 10,
  windowMs: 60 * 1000,
  handler: function (req, res) {
    return res.status(429).send("Too many requests");
  },
});

//choose db
const queries = require("./db/dbSequelize");

//http
const server = http.createServer(app);
app.use(
  cors({
    origin: "*",
  })
);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

//ws
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.onAny(() => {
    io.emit("event");
  });
});

app.get("/tasks", queries.sendTodos);
app.post("/tasks/:id", limitCRUDRequestsCount, queries.createTodo);
app.put("/tasks/:id", limitCRUDRequestsCount, queries.updateTodo);
app.delete("/tasks/:id", limitCRUDRequestsCount, queries.deleteTodo);
app.post("/sessions", limitLoginRequestsCount, queries.validateUser);
app.post("/users", queries.createUser);
app.get("/logs", queries.sendLogs);

module.exports = app;
