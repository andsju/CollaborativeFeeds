var db = require("../configs/db.js");


function Feed() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS sample ( " +
                            "sample_id int(11) NOT NULL AUTO_INCREMENT, " +
                            "sample_name varchar(100) DEFAULT '', " +
                            "PRIMARY KEY (sample_id) ) " +
                            "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM sample";
    this.selectLimit    =   "SELECT * FROM sample LIMIT ?";
    this.selectSearch   =   "SELECT * FROM sample WHERE sample_name LIKE ?";
    this.insert         =   "INSERT INTO sample SET ?";
    this.updateId       =   "UPDATE sample SET ? WHERE sample_id = ?";
    this.deleteId       =   "DELETE FROM sample WHERE sample_id = ?";
}

module.exports = new Feed();
