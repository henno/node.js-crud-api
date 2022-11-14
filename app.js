const express = require('express');
const cors = require('cors')
const app = express();
const queries = require('./queries')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: '*'
}));


app.get('/', queries.getTodos)
app.post('/', queries.createTodo)
app.put('/:id', queries.updateTodo)
app.delete('/:id', queries.deleteTodo)

module.exports = app;
