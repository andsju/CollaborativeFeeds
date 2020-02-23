/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var user = require("../models/user_model.js");
var functions = require("../libs/functions.js");
var feedCollaborate = require("../models/feed_collaborate_model.js");
var feedCollaborateChannel = require("../models/feed_collaborate_channel_model.js");
var feedCollaborateChannelResponse = require("../models/feed_collaborate_channel_response_model.js");

var data;

router.route("")
    .get(function(req, res) {

        var objUser = req.session.user || undefined;
        if (objUser === undefined) {
            res.redirect("/");
            return null;
        }
        var data = { success: "", message: "", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/collaborate", data);
    });

router.route("/channel/:id")
    .get(function(req, res) {

        var objUser = req.session.user || undefined;
        if (objUser === undefined) {
            res.redirect("/");
            return null;
        }
        var data = { success: "", message: "", user: objUser, csrfToken: req.csrfToken(), channel: req.params.id};
        res.render("pages/channel", data);
    });

router.route("/channel/:channel/:id/response")
    .get(function(req, res) {
        var objUser = req.session.user || undefined;
        if (objUser === undefined) {
            res.redirect("/");
            return null;
        }

        var channel = req.params.channel || "";
        var id = req.params.id || 0;

        new Promise(function (resolve, reject) {

            mysqlPool.query(feedCollaborateChannel.selectChannel, channel, function(error, result) {
                if (error) { throw new Error(error); }
                resolve(result);
            });

        }).then(function (data) {

            new Promise(function (resolve, reject) {

                mysqlPool.query(feedCollaborateChannelResponse.selectChannelId, data[0].feed_collaborate_channel_id, function(error, result) {
                    if (error) { throw new Error(error); }
                    resolve(result);
                });

            }).then(function (data) {

                var data = {user: objUser, csrfToken: req.csrfToken(), rows: data, form: true, flash: ""};
                res.render("pages/response", data);
            });

        });

    });

router.route("/channel/:id")
    .post(function(req, res) {

        var objUser = req.session.user || undefined;
        if (objUser === undefined) {
            res.redirect("/");
            return null;
        }

        var userId = req.body.userId || 0;
        var channelId = req.body.channelId || 0;
        var response = req.body.response || "";
        response = functions.truncate(response, 1000);

        mysqlPool.query(feedCollaborateChannelResponse.insert, [{user_id: userId, feed_collaborate_channel_id: channelId, response: response}], function(error, result) {
            if (error) {
                throw new Error(error);
            }
            data = {
                success: true,
                message: "Response saved",
                feedCollaborateResponseId: result.insertId
            };

            var data = { success: "", message: "", user: objUser, csrfToken: req.csrfToken(), channel: req.params.id};
            res.render("pages/channel", data);
        });
    });

router.route("")
    .post(function(req, res) {

        var action = req.body.action || "";
        var objUser = req.session.user || undefined;

        if (objUser === undefined || objUser.role !== "administrator") {
            data = {
                success: false,
                message: "Administrator role required"
            };
            res.contentType("json");
            res.send(JSON.stringify(data));
            return null;
        }

        switch (action) {

            case "get_channel":
                var channel = functions.getChannel();
                var title = objUser.email;

                mysqlPool.query(feedCollaborate.insert, [{title: title, user_id: objUser.id, channel: channel}], function(error, result) {
                    if (error) {
                        throw new Error(error);
                    }
                    data = {
                        success: true,
                        message: "Channel created",
                        channel: channel,
                        feedCollaborateId: result.insertId
                    };

                    req.session.user.channel = channel;
                    res.send(JSON.stringify(data));
                });

                break;
        }

    });

module.exports = router;
