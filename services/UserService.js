const jwt = require("jsonwebtoken");
const {UserModel, SessionModel} = require("../db/dbSequelize");

async function userExists(username) {
    let user;
    await UserModel.findOne({where: {username: username}}).then((data) => {
        user = data != null;
    });
    return user;
}

const create = async (req, res) => {
    if ((await userExists(req.body.username)) === false) {
        UserModel
            .create({username: req.body.username, password: req.body.password})
            .then(() => {
                res.status(201).send({success: "New user created successfully!"});
            })

            .catch((err) => {
                res.status(500).send({
                    message: err.message || "Internal server error",
                });
            });
    } else {
        res.status(409).send({error: "Conflict, this user already exists!"});
    }
};

const validate = (req, res) => {
    UserModel
        .findOne({
            where: [{
                username: req.body.username,
                password: req.body.password,
            }]
        })
        .then((user) => {

            if (user === null) {
                return res
                    .status(401)
                    .send({error: "Unauthorized. Please try logging in again."});
            }

            let token = jwt.sign({UserID: user.id}, jwt_secret);
            SessionModel.create({token: token, userId: user.id});
            res.send({id: user.id, token: token});

        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Internal server error",
            });
        });
};

const requireAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send("Authorization header is required");
    }

    const token = req.headers.authorization.split(" ")[1];

    if (token === "null") {
        return res.status(401).send("Malformed token in authorization header");
    }

    // Get session by token from db
    const session = await Session.get(token);

    // If session is not found, return 401
    if (!session) {
        return res.status(401).send("Invalid token in authorization header");
    }

    req.userId = session.userId;

    next();

}


// Export all functions
module.exports = {
    create,
    validate,
    requireAuth,
}
