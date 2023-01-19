const Sequelize = require("sequelize");
const {DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
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

// logging
const logs = [];

const saveLogs = (data, method, firstValue, secondValue) => {
    const subLog = []

    let date = JSON.stringify(data.get('updatedAt'))
    let newDate = date.replaceAll(/T/g, ", ").replaceAll(/"/g, "")

    subLog.push(newDate.slice(0, 17), method, data.get("userID"), firstValue, secondValue)

    logs.push(subLog)
}

todos.beforeCreate((instance, options) => {
    const method = 'POST'
    console.log(instance.get("title"))
    if(instance.get("title") === "" && instance.get("completed") === "") {
        return null
    }
    else {
    saveLogs(instance, method, 'Added ' + JSON.stringify(instance.get("title")),'Added ' + JSON.stringify(instance.get("completed")))
    }
    }
);

todos.beforeUpdate((instance, options) => {
    const method = 'PUT'
    if(instance.previous("title") === instance.get("title") && instance.previous("completed") === instance.get("completed")) {
        return null
    }
    else {
    saveLogs(instance, method, 'Changed ' + JSON.stringify(instance.previous("title")) + ' to ' + JSON.stringify(instance.get("title")),'Changed ' + JSON.stringify(instance.previous("completed")) + ' to ' + JSON.stringify(instance.get("completed")))
    }
    }
);

todos.beforeDestroy((instance, options) => {
    const method = 'DELETE'
    saveLogs(instance, method, 'Deleted ' + JSON.stringify(instance.previous("title")), 'Deleted ' + JSON.stringify(instance.previous("completed")))
    }
);

const sendLogs = (req, res) => {
    if (logs === null)
        res.status(500).send(
            {error : "Internal server error"}
        )
    else {
        res.send(logs);
    }
}

// authorization
const jwt = require("jsonwebtoken");
const jwt_secret =
    "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

let sessionToken;

function checkIfTokenExists (token) {
    return token===undefined
}

function checkToken(token) {
    if (checkIfTokenExists(token)){
        return false
    }
    else {
        return sessionToken === token.replace('Bearer ', '');
    }
}

// endpoints
const createUser = (req, res) => {
    users.findOne({ where: {username: req.body.username} })
        .then(data => {
            if (data != null){
                res.status(409).send(
                    {error : "Conflict, this user already exists!"}
                )
            }
            else {
                users.create({username: req.body.username, password: req.body.password})
                    .then(() => {
                        res.status(201).send(
                            {success : "New user created successfully!"}
                        )
                    })
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error"
            });
        });
}

const validateUser = (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    };
    users.findOne({ where: [credentials] })
        .then(data => {
            if (data === null){
                res.status(401).send(
                    {error : "Unauthorized. Please try logging in again."}
                )
            }
            else {
                let token = jwt.sign({ UserID: data.id }, jwt_secret);
                sessionToken = token
                res.send({id: data.id, token: token})
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error"
            });
        });
}

const authorizeUser = (req, res) => {

    if (checkToken(req.headers.authorization) === true) {
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
                        err.message || "Internal server error"
                });
            });
    }
    else {
        res.status(401).send(
            {error : "Unauthorized. Please try logging in again."}
        )
    }

}

const sendTodos = (req, res) => {
    todos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error"
            });
        });
}

const createTodo = (req, res) => {

    if (checkToken(req.headers.authorization) === true) {

        const todo = {
            title: req.body.title,
            completed: req.body.completed,
            userID: req.params.id
        };

        todos.create(todo)
            .then(() => {
                res.status(201).send(
                    {success : "Data created"}
                )
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal server error"
                });
            });
    }
    else {
        res.status(401).send(
            {error : "Unauthorized. Please try logging in again."}
        )
    }

};

const updateTodo = (req, res) => {

    if (checkToken(req.headers.authorization) === true) {

        const id = req.params.id;

        todos.update(req.body, {
            where: {id: id},
            individualHooks: true
        })
            .then(() => {
                res.status(202).send(
                    {success : "Data updated"}
                )
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal server error"
                });
            });
    }
    else {
        res.status(401).send(
            {error : "Unauthorized. Please try logging in again."}
        )
    }
};

const deleteTodo = (req, res) => {

    if (checkToken(req.headers.authorization) === true) {

        const id = req.params.id;

        todos.destroy({
            where: {id: id},
            individualHooks: true
        })
            .then(() => {
                res.status(202).send(
                    {success : "Data updated"}
                )
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal server error"
                });
            });
    }
    else {
        res.status(401).send(
            {error : "Unauthorized. Please try logging in again."}
        )
    }
};

module.exports = {
    sendTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    validateUser,
    authorizeUser,
    createUser,
    sendLogs
}

