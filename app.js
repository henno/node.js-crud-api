require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const http = require("http");
const {Server} = require("socket.io");

// Controllers
const TaskController = require("./controllers/TaskController");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");
const LogController = require("./controllers/LogController");

// Services
const {requireAuth} = require("./services/UserService");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

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

//http
const server = http.createServer(app);
app.use(
    cors({
        origin: "*",
    })
);
const port = process.env.PORT;
server.listen(port, () => {
    console.log(`App running at http://localhost:${port}. Docs at http://localhost:${port}/docs`);
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


// Routes
app.post("/sessions", limitLoginRequestsCount, SessionController.post);
app.get("/logs", limitCRUDRequestsCount, requireAuth, LogController.get);
app.get("/tasks", limitCRUDRequestsCount, requireAuth, TaskController.get);
app.post("/tasks", limitCRUDRequestsCount, requireAuth, TaskController.post);
app.post("/users", limitCRUDRequestsCount, requireAuth, UserController.post);
app.put("/tasks/:id", limitCRUDRequestsCount, requireAuth, TaskController.put);
app.delete("/tasks/:id", limitCRUDRequestsCount, requireAuth, TaskController.destroy);

module.exports = app;
