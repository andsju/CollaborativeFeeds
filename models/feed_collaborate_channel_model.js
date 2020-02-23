var db = require("../configs/db.js");

function FeedCollaborateChannel() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed_collaborate_channel ( " +
        "feed_collaborate_channel_id int(11) NOT NULL AUTO_INCREMENT, " +
        "feed_collaborate_id int(11) NOT NULL DEFAULT 0, " +
        "channel varchar(10) DEFAULT '', " +
        "title varchar(1000) DEFAULT '', " +
        "description varchar(5000) DEFAULT '', " +
        "image varchar(1000) DEFAULT '', " +
        "meta varchar(1000) DEFAULT '', " +
        "instruction varchar(1000) DEFAULT '', " +
        "format varchar(25) DEFAULT '', " +
        "countdown int(3) DEFAULT 120, " +
        "PRIMARY KEY (feed_collaborate_channel_id) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed_collaborate_channel";
    this.selectLimit    =   "SELECT * FROM feed_collaborate_channel LIMIT ?";
    this.selectChannel  =   "SELECT * FROM feed_collaborate_channel WHERE channel = ? ORDER BY feed_collaborate_channel_id DESC";
    this.selectId       =   "SELECT * FROM feed_collaborate_channel WHERE feed_collaborate_channel = ?";
    this.insert         =   "INSERT INTO feed_collaborate_channel SET ?";
    this.updateId       =   "UPDATE feed_collaborate_channel SET ? WHERE feed_collaborate_channel_id = ?";
    this.deleteId       =   "DELETE FROM feed_collaborate_channel WHERE feed_collaborate_channel_id = ?";
}

module.exports = new FeedCollaborateChannel();
