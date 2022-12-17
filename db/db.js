const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "Daniilo",
    password: "qwerty",
    database: "todo"
});

db.connect(function(err) {
    if (err) throw err;
});

const getTodos = (request, response) => {

    db.query('SELECT * FROM todos', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        response.json(results)
    })
}

const createTodo = (request, response) => {

    let newTitle = request.body.title
    let newCompleted = request.body.completed

    db.query('INSERT INTO todos (title, completed) VALUES (?, ?)', [newTitle, newCompleted] , (error, results) => {
        if (error) {
            throw error
        }
        response.send(request.body)
    })
}

const updateTodo = (request, response) => {

    let id = parseInt(request.params.id)
    let updatedTitle = request.body.title
    let updatedCompleted = request.body.completed

    db.query(
        'UPDATE todos SET  title = ?, completed = ? WHERE id = ?',
        [updatedTitle, updatedCompleted, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.send(request.body)
        }
    )
}

const deleteTodo = (request, response) => {

    const id = parseInt(request.params.id)

    db.query('DELETE FROM todos WHERE id = ?', [id], (error) => {
        if (error) {
            throw error
        }
        response.send(`User deleted with ID: ${id}`)
    })
}

const getUser = (request, response) => {

    let username = request.body.username
    let password = request.body.password
    db.query('select * from users where Username = ? and Password = ?', [username, password] , (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        // response.send(request.body)
    })
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getUser
}

