const {logs: LogModel} = require("../db/dbSequelize");

const get = async (req, res) => {

    // Get logs from database
    let logs = await LogModel.findAll({where: {userId: req.params.id}});
    res.send(logs);

}


function create(eventName, userId, extraData) {

    // Create timestamp
    const timeStamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

    // Parse extraData and eventName to JSON and escape the delimiter with backslash
    extraData = JSON.stringify(extraData).replace(/　/g, '\\　');

    // Write to db
    LogModel.create({
        date: timeStamp,
        method: eventName,
        userId: userId,
        changes: extraData,
    });


}


const destroy = (req, res) => {

};

const update = (req, res) => {

};

module.exports = {
    get,
    update,
    destroy,
    create
}
