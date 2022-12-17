const Sequelize = require("sequelize");
const {DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    'todo',
    'Daniilo',
    'qwerty',
    {        host: 'Localhost',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


const todos = sequelize.define("sequelizeTodos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
    },
    completed: {
        type: DataTypes.STRING,
    }
});

sequelize.sync()
    .then(() => {
        console.log("Synced sequelize db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

const getTodos = (req, res) => {
    todos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
}

const createTodo = (req, res) => {

    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Tutorial
    const todo = {
        title: req.body.title,
        completed: req.body.completed,
    };

    todos.create(todo)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

const updateTodo = (req, res) => {
    const id = req.params.id;

    todos.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Todo was updated successfully."
                });
            } else {
                res.send({
                    message: "Cannot uodate todo with id=${id}."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

const deleteTodo = (req, res) => {
    const id = req.params.id;

    todos.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Todo was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete todo with id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};




module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    // getUser
}
