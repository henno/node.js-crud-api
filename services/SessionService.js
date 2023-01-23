// Import db
const {SessionModel: SessionModel} = require("../db/dbSequelize");

const get = async (token) => {
    return await SessionModel.findOne({where: {token: token}})
}

const create = async (userId) => {

    // Get jwt_secret
    const jwt_secret = process.env.JWT_SECRET;
    console.log(jwt_secret)

    // Generate token
    let token = jwt.sign({UserID: userId}, jwt_secret);
    return await SessionModel.create({token: token, userId: user.id})
}

const destroy = async (token) => {
    return await SessionModel.destroy({where: {token: token}})
};

module.exports = {
    get,
    create,
    destroy,

}
