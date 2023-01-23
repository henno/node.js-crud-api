const {items: TaskModel} = require("../db/dbSequelize");
const {TaskModel} = require("../db/dbSequelize");

const get = async (req, res) => {

    return await todos.findAll({where: filter})
}

const create = (req, res) => {


    TaskModel
        .create({
            title: req.body.title,
            completed: req.body.completed,
            userID: req.params.id,
        })
        .then(() => {
            res.status(201).send({success: "Item created"});
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Internal server error",
            });
        });

};

const destroy = (req, res) => {
    if (isValidToken(req.headers.authorization)) {
        const id = req.params.id;

        todos
            .destroy({
                where: {id: id},
                individualHooks: true,
            })
            .then(() => {
                res.status(202).send({success: "Data updated"});
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Internal server error",
                });
            });
    } else {
        res.status(403).send({error: "Forbidden! User has no authorization!"});
    }
};


const update = (req, res) => {
    if (isValidToken(req.headers.authorization)) {
        const id = req.params.id;

        todos
            .update(req.body, {
                where: {id: id},
                individualHooks: true,
            })
            .then(() => {
                res.status(202).send({success: "Data updated"});
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Internal server error",
                });
            });
    } else {
        res.status(403).send({error: "Forbidden! User has no authorization!"});
    }
};

// Export all functions
module.exports = {
    get,
    update,
    create,
    destroy
}
