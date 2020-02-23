/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();

// database MySQL
var mysqlPool = require("../configs/db.js");

var user = require("../models/user_model.js");
var feed = require("../models/feed_model.js");
var feedView = require("../models/feed_view_model.js");
var feedViewMember = require("../models/feed_view_member_model.js");
var feedHistory = require("../models/feed_history_model.js");
var feedCollaborate = require("../models/feed_collaborate_model.js");
var feedCollaborateChannel = require("../models/feed_collaborate_channel_model.js");
var feedCollaborateChannelResponse = require("../models/feed_collaborate_channel_response_model.js");

router.route("/")
    .get(function(req, res) {

        mysqlPool.query(user.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table user created");
            }
        });

        mysqlPool.query(feed.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed created");
            }
        });

        mysqlPool.query(feedView.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed_view created");
            }
        });

        mysqlPool.query(feedViewMember.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed_view_member created");
            }
        });

        mysqlPool.query(feedHistory.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed_history created");
            }
        });

        mysqlPool.query(feedCollaborate.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed_collaborate created");
            }
        });
        mysqlPool.query(feedCollaborateChannel.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed_collaborate_channel created");
            }
        });
        mysqlPool.query(feedCollaborateChannelResponse.initiate, function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log("Table feed_collaborate_channel_response created");
            }
        });

        res.send("Initiated");
    });

module.exports = router;

