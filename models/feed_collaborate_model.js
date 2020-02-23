var db = require("../configs/db.js");

function FeedCollaborate() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed_collaborate ( " +
        "feed_collaborate_id int(11) NOT NULL AUTO_INCREMENT, " +
        "user_id int(11) NOT NULL DEFAULT 0, " +
        "channel varchar(10) DEFAULT '', " +
        "title varchar(255) DEFAULT '', " +
        "PRIMARY KEY (feed_collaborate_id) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed_collaborate";
    this.selectLimit    =   "SELECT * FROM feed_collaborate LIMIT ?";
    this.selectSearch   =   "SELECT * FROM feed_collaborate WHERE title LIKE ?";
    this.insert         =   "INSERT INTO feed_collaborate SET ?";
    this.updateId       =   "UPDATE feed_collaborate SET ? WHERE feed_collaborate_id = ?";
    this.deleteId       =   "DELETE FROM feed_collaborate WHERE feed_collaborate_id = ?";
}

module.exports = new FeedCollaborate();
