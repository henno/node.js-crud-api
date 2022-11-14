const db = require('./db');

const getTodos = (request, response) => {

    db.query('SELECT * FROM todos', (error, results) => {
        if (error) {
            throw error
        }
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

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
}
