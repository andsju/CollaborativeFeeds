var db = require("../configs/db.js");

function FeedViewMember() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed_view_member ( " +
        "feed_view_member_id int(11) NOT NULL AUTO_INCREMENT, " +
        "feed_view_id int(11) NOT NULL, " +
        "feed_id int(11) NOT NULL, " +
        "PRIMARY KEY (feed_view_member_id) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed_view_member WHERE feed_view_id = ?";
    this.selectJoin     =   "SELECT feed.title, feed.link, feed.feed_id FROM feed LEFT JOIN feed_view_member ON feed.feed_id = feed_view_member.feed_id LEFT JOIN feed_view ON feed_view_member.feed_view_id = feed_view.feed_view_id WHERE feed_view.feed_view_id = ?";
    this.selectLimit    =   "SELECT * FROM feed_view_member LIMIT ?";
    this.selectMatch    =   "SELECT * FROM feed_view_member WHERE feed_view_id = ? AND feed_id = ?";
    this.insert         =   "INSERT INTO feed_view_member SET ?";
    this.deleteId       =   "DELETE FROM feed_view_member WHERE feed_view_id = ? AND feed_id = ?";
    this.deleteView     =   "DELETE FROM feed_view_member WHERE feed_view_id = ?";
}

module.exports = new FeedViewMember();
