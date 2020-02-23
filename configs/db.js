// use mysql
var mysql = require("mysql");
// config credentials
var config = require("./config.js");

var mysqlPool = mysql.createPool({
    connectionLimit: config.mysql.connectionLimit,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});



module.exports = mysqlPool;
