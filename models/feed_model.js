var db = require("../configs/db.js");


function Feed() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed ( " +
                            "feed_id int(11) NOT NULL AUTO_INCREMENT, " +
                            "title varchar(100) DEFAULT '', " +
                            "link varchar(255) DEFAULT '', " +
                            "description varchar(1000) DEFAULT '', " +
                            "language varchar(10) DEFAULT '', " +
                            "category varchar(255) DEFAULT '', " +
                            "image_url varchar(255) DEFAULT '', " +
                            "image_title varchar(255) DEFAULT '', " +
                            "days_before_delete int(4) DEFAULT 30, " +
                            "PRIMARY KEY (feed_id) ) " +
                            "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed ORDER BY title ASC";
    this.selectLimit    =   "SELECT * FROM feed LIMIT ?";
    this.selectSearch   =   "SELECT * FROM feed WHERE title LIKE ?";
    this.selectLink     =   "SELECT * FROM feed WHERE link = ?";
    this.selectId       =   "SELECT * FROM feed WHERE feed_id = ?";
    this.selectCategory =   "SELECT * FROM feed WHERE category LIKE ?";
    this.insert         =   "INSERT INTO feed SET ?";
    this.updateId       =   "UPDATE feed SET ? WHERE feed_id = ?";
    this.deleteId       =   "DELETE FROM feed WHERE feed_id = ?";
}

module.exports = new Feed();
