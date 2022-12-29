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
    },
    userID: {
        type: DataTypes.INTEGER
    }
});

const users = sequelize.define("sequelizeUsers", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
},
{timestamps: false});

sequelize.sync()
    .then(() => {
        console.log("Synced sequelize db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

const validateUser = (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    };
    users.findOne({ where: [credentials] })
        .then(data => {
            if (data === null){
                res.status(401).send(
                    false
                )
            }
            else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

const authorizeUser = (req, res) => {
    const credentials = {
        userID: req.body.id,
    };
    console.log(credentials)
    todos.findAll({ where: [credentials] })
        .then(data => {
                res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

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
    // if (!req.body.title) {
    //     res.status(401).send({
    //         message: "Content can not be empty!"
    //     });
    //     return;
    // }

    const todo = {
        title: req.body.title,
        completed: req.body.completed,
        userID: req.body.userID
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
                    message: "Cannot update todo with id=${id}."
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
    console.log(id)
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
    validateUser,
    authorizeUser
}

