const express = require('express');
const cors = require('cors')
const app = express();
const queries = require('./queries')
const http = require('http');
const { Server } = require("socket.io");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//http
const server = http.createServer(app)
app.use(cors({
    origin: '*'
}));

const port = process.env.PORT || 3001;
server.listen(3001, () => {
    console.log(`Server started on port: ${port}`);
});

//ws
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.onAny(() => {
        io.emit('event')
    });
});

app.get('/', queries.getTodos)
app.post('/', queries.createTodo)
app.put('/:id', queries.updateTodo)
app.delete('/:id', queries.deleteTodo)

module.exports = app;
