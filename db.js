const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "Daniilo",
    password: "qwerty",
    database: "todo"
});

db.connect(function(err) {
    if (err) throw err;
});

module.exports = db;
