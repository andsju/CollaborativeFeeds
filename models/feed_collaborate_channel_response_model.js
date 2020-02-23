var db = require("../configs/db.js");

function FeedCollaborateChannelResponse() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed_collaborate_channel_response ( " +
        "feed_collaborate_channel_response_id int(11) NOT NULL AUTO_INCREMENT, " +
        "feed_collaborate_channel_id int(11) NOT NULL DEFAULT 0, " +
        "user_id int(11) NOT NULL DEFAULT 0, " +
        "response varchar(5000) DEFAULT '', " +
        "PRIMARY KEY (feed_collaborate_channel_response_id) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed_collaborate_channel_response";
    this.selectLimit    =   "SELECT * FROM feed_collaborate_channel_response LIMIT ?";
    this.selectId       =   "SELECT * FROM feed_collaborate_channel_response WHERE feed_collaborate_channel_response_id = ?";
    this.selectChannelId =   "SELECT * FROM feed_collaborate_channel_response WHERE feed_collaborate_channel_id = ? ORDER BY feed_collaborate_channel_response_id DESC";
    this.insert         =   "INSERT INTO feed_collaborate_channel_response SET ?";
    this.updateId       =   "UPDATE feed_collaborate_channel_response SET ? WHERE feed_collaborate_channel_response_id = ?";
    this.deleteId       =   "DELETE FROM feed_collaborate_channel_response WHERE feed_collaborate_channel_response_id = ?";
}

module.exports = new FeedCollaborateChannelResponse();
