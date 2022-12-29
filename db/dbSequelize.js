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
                    err.message || "Some error occurred while retrieving todos."
            });
        });
}

const createTodo = (req, res) => {

    const todo = {
        title: req.body.title,
        completed: req.body.completed,
        userID: req.body.userID
    };

    todos.create(todo)
        .then( ()=> {
            res.sendStatus(200);
        })
        .catch( () => {
            res.sendStatus(500);
        });
};

const updateTodo = (req, res) => {

    const id = req.params.id;

    todos.update(req.body, {
        where: { id: id }
    })
        .then( ()=> {
            res.sendStatus(200);
        })
        .catch( () => {
            res.sendStatus(500);
        });
};

const deleteTodo = (req, res) => {

    const id = req.params.id;

    todos.destroy({
        where: { id: id }
    })
        .then( ()=> {
            res.sendStatus(200);
        })
        .catch(() => {
            res.sendStatus(500);
        });
};

const getLogs = (req, res) => {

}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    validateUser,
    authorizeUser
}

