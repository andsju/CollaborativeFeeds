/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

function FeedHistory() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS feed_history ( " +
        "feed_history_id int(11) NOT NULL AUTO_INCREMENT, " +
        "feed_id int(11) NOT NULL DEFAULT 0, " +
        "link varchar(255) DEFAULT '', " +
        "title varchar(1000) DEFAULT '', " +
        "description varchar(5000) DEFAULT '', " +
        "description_text varchar(5000) DEFAULT '', " +
        "categories varchar(255) DEFAULT '', " +
        "datepub DATETIME NOT NULL DEFAULT '1000-01-01 00:00:00', " +
        "date_saved DATETIME NOT NULL DEFAULT '1000-01-01 00:00:00', " +
        "PRIMARY KEY (feed_history_id), FULLTEXT INDEX rss_index (title, description_text) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM feed_history";
    this.selectLimit    =   "SELECT * FROM feed_history LIMIT ?";
    this.selectSearch   =   "SELECT * FROM feed WHERE title LIKE ?";
    this.selectAllIds   =   "SELECT * FROM feed_history WHERE feed_id IN (' ? ') ORDER BY datepub DESC LIMIT 10";
    this.insert         =   "INSERT INTO feed_history SET ?";
    this.updateId       =   "UPDATE feed_history SET ? WHERE feed_history_id = ?";
    this.updateLink     =   "UPDATE feed_history SET ? WHERE link = ?";
    this.deleteId       =   "DELETE FROM feed_history WHERE feed_history_id = ?";
    this.deleteFeedId   =   "DELETE FROM feed_history WHERE feed_id = ?";
    this.deleteAll      =   "DELETE FROM feed_history WHERE feed_history_id > ?";

}

module.exports = new FeedHistory();
