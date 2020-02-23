/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

function User() {
    this.initiate       =   "CREATE TABLE IF NOT EXISTS user ( " +
        "user_id int(11) NOT NULL AUTO_INCREMENT, " +
        "username varchar(25) DEFAULT '', " +
        "email varchar(255) DEFAULT '', " +
        "password varchar(255) DEFAULT '', " +
        "role varchar(25) DEFAULT '', " +
        "date_saved DATETIME NOT NULL DEFAULT '1000-01-01 00:00:00', " +
        "PRIMARY KEY (user_id) ) " +
        "ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
    this.selectAll      =   "SELECT * FROM user";
    this.selectLimit    =   "SELECT * FROM user LIMIT ?";
    this.selectEmail    =   "SELECT * FROM user WHERE email = ?";
    this.selectUserId    =   "SELECT * FROM user WHERE user_id = ?";
    this.login          =   "SELECT * FROM user WHERE email = ? AND password = ?";
    this.selectSearch   =   "SELECT * FROM user WHERE username LIKE ? OR email LIKE ?";
    this.insert         =   "INSERT INTO user SET ?";
    this.updateId       =   "UPDATE user SET ? WHERE user_id = ?";
    this.deleteId       =   "DELETE FROM user WHERE user_id = ?";
}

module.exports = new User();
