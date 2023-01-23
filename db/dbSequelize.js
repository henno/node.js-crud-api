const Sequelize = require("sequelize");
const {DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });

const TaskModel = sequelize.define(
    "sequelizeTasks",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        completed: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
    });


const UserModel = sequelize.define(
    "sequelizeUsers",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
    },
    {timestamps: false}
);

// Create sessions schema
const SessionModel = sequelize.define(
    "sequelizeSessions",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
    },
    {timestamps: false}
);

// Create logs schema
const LogModel = sequelize.define(
    "sequelizeLogs",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.STRING,
        },
        method: {
            type: DataTypes.STRING,
        },
        userID: {
            type: DataTypes.INTEGER,
        },
        changes: {
            type: DataTypes.STRING,
        },

    },
    {timestamps: false}
);

sequelize
    .sync()
    .then(() => {
        console.log("Synced sequelize db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });


function formatDate(date) {
    let newDate = date.replaceAll(/T/g, ", ").replaceAll(/"/g, "");
    return newDate.slice(0, 17);
}

const saveLogs = ({data, method, changes}) => {
    let date = formatDate(JSON.stringify(data.get("updatedAt")));
    const subLog = [];
    subLog.push(date, method, data.get("userID"), changes);
    LogModel.push(subLog);
};

TaskModel.beforeCreate((instance, options) => {
    if (instance.get("title") === "" && instance.get("completed") === "") {
        return null;
    } else {
        saveLogs({
            data: instance,
            method: "POST",
            firstValue: "Added " + JSON.stringify(instance.get("title")),
            secondValue: "Added " + JSON.stringify(instance.get("completed")),
        });
    }
});

TaskModel.beforeUpdate((instance, options) => {
    if (
        instance.previous("title") === instance.get("title") &&
        instance.previous("completed") === instance.get("completed")
    ) {
        return null;
    } else {
        saveLogs({
            data: instance,
            method: "PUT",
            firstValue:
                "Changed " +
                JSON.stringify(instance.previous("title")) +
                " to " +
                JSON.stringify(instance.get("title")),
            secondValue:
                "Changed " +
                JSON.stringify(instance.previous("completed")) +
                " to " +
                JSON.stringify(instance.get("completed")),
        });
    }
});

TaskModel.beforeDestroy((instance, options) => {
    saveLogs({
        data: instance,
        method: "DELETE",
        firstValue: "Deleted " + JSON.stringify(instance.previous("title")),
        secondValue: "Deleted " + JSON.stringify(instance.previous("completed")),
    });
});




module.exports = {
    SessionModel,
    TaskModel,
    UserModel
};
