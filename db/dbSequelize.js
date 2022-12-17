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

const getTodos = (async () => {
    await sequelize.sync({ force: false });
    return await todos.findAll()
})();


// const insert = await todos.create({ title: "Not", completed: "yet" });


module.exports = {
    getTodos,
    // createTodo,
    // updateTodo,
    // deleteTodo,
    // getUser
}
