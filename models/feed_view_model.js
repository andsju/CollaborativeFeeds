var db = require("../configs/db.js");

function Feedview() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed_view ( " +
        "feed_view_id int(11) NOT NULL AUTO_INCREMENT, " +
        "user_id int(11) NOT NULL, " +
        "title varchar(100) DEFAULT '', " +
        "PRIMARY KEY (feed_view_id) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed_view WHERE user_id = ?";
    this.selectView     =   "SELECT * FROM feed_view WHERE feed_view_id = ? AND user_id = ?";
    this.selectLimit    =   "SELECT * FROM feed_view LIMIT ?";
    this.selectSearch   =   "SELECT * FROM feed_view WHERE title LIKE ?";
    this.insert         =   "INSERT INTO feed_view SET ?";
    this.updateId       =   "UPDATE feed_view SET ? WHERE feed_view_id = ?";
    this.deleteId       =   "DELETE FROM feed_view WHERE feed_view_id = ?";
}

module.exports = new Feedview();
