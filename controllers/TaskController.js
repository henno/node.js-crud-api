const Task = require("../services/TaskService");
const User = require("../services/UserService");


const get = async (req, res) => {

    try {
        return res.status(200).json(await Task.get({userId: req.userId}));
    }
    catch (e) {
        return res.status(500).send({error: e.message});
    }
}

module.exports = {
    get,
}
