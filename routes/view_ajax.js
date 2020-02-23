/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();

var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var user = require("../models/user_model.js");
var feedView = require("../models/feed_view_model.js");
var feedHistory = require("../models/feed_history_model.js");
var feedViewMember = require("../models/feed_view_member_model.js");
var feedCollaborateChannel = require("../models/feed_collaborate_channel_model.js");
var striptags = require("striptags");
var functions = require("../libs/functions.js");

var data;
var action;
var message;
var success = false;

router.route("/")
    .post(function(req, res) {

        var objUser = req.session.user || null;
        action = req.body.action || "";

        if (objUser) {

            switch(action) {

                case "view_save":

                    var title = req.body.title.trim() || "";

                    if (validate.validate(title, "title")) {
                        mysqlPool.query(feedView.insert, [{title: title, user_id: objUser.id}], function(error, result) {
                            if (error) {
                                throw new Error(error);
                            }
                            data = {
                                success: true,
                                message: "View registered successfully",
                                viewId: result.insertId
                            };
                            res.send(JSON.stringify(data));
                        });
                    } else {
                        data = {
                            success: false,
                            message: "View not registered",
                            viewId: 0
                        };
                        res.send(JSON.stringify(data));
                    }
                   break;


                case "view_edit":

                    var title = req.body.title.trim() || "";
                    var id = req.body.viewId || 0;
                    if (validate.validate(title, "title")) {

                        mysqlPool.query(feedView.updateId, [{title: title}, id], function(error, result) {
                            if (error) {
                                throw new Error(error);
                            }
                            data = {
                                success: true,
                                message: "View saved"
                            };
                            res.send(JSON.stringify(data));
                        });
                    } else {
                        data = {
                            success: false,
                            message: "View not saved"
                        };
                        res.send(JSON.stringify(data));
                    }
                    break;

                case "view_delete":

                    var id = req.body.viewId || 0;
                    mysqlPool.query(feedViewMember.deleteView, id, function(error, result) {
                        if (error) {
                            throw new Error(error);
                        }

                        if(result) {
                            mysqlPool.query(feedView.deleteId, id, function(error, result) {
                                if (error) {
                                    throw new Error(error);
                                }
                                data = {
                                    success: true,
                                    message: "View deleted"
                                };
                                res.send(JSON.stringify(data));
                            });
                        }
                    });
                    break;


                case "view_link":

                    var ids = req.body.ids || [];
                    console.log("req.body.page", req.body.page);
                    var page = req.body.page == undefined || isNaN(req.body.page) ? 20 : req.body.page; 
                    //var page = validate(req.body.page,"numbers") === true ? req.body.page : 20;
                    //var page = req.body.page || 20;
                    console.log("page", page);
                    page = parseInt(page);
                    var start = page === 20 ? 0 : page + 20;

                    // set ids to 0 in order to return nothing from database
                    ids = ids.length === 0 ? 0 : ids;

                    var sql = "SELECT feed_history.feed_history_id, feed_history.title, feed_history.description, feed_history.datepub, feed_history.link, feed.title AS titleRSS FROM feed JOIN feed_history ON feed.feed_id = feed_history.feed_id WHERE feed.feed_id IN (" + ids + ") ORDER BY feed_history.datepub DESC LIMIT " + start + "," + page;
                    console.log(sql);
                    mysqlPool.query(sql, function(error, rows) {
                        if (error) {
                            throw new Error(error);
                        }
                        if (rows.length === 0) {
                            // show simple form to create first view
                            res.send("");
                        } else {
                            var data = {feeds: rows};
                            res.send(rows);
                        }
                    });

                    break;

                case "view_searchwords":

                    var ids = req.body.ids || [];
                    var words = req.body.words || [];
                    var queryParts = [];
                    var useFullTextSearch = false;
                    var skip = false;
                    for (var i = 0; i < words.length; i += 1) {
                        queryParts.push("'%" + words[i] + "%'");
                        if (skip === false) {
                            if (words[i].length >= 4) {
                                useFullTextSearch = true;
                                skip = true;
                            }
                        }
                    }

                    var titles = queryParts.join(" AND feed_history.title like ");
                    var description = queryParts.join(" AND feed_history.description like ");
                    var ws = words.join(" ");

                    // full-text searches ignore short words, default four characters for MyISAM
                    var sql = "SELECT feed_history.title, feed_history.description, feed_history.description_text, feed_history.datepub, feed.title AS titleRSS, " +
                        " MATCH (feed_history.title,feed_history.description_text) AGAINST ('" + ws + "' IN NATURAL LANGUAGE MODE) AS score " +
                        " FROM feed JOIN feed_history ON feed.feed_id = feed_history.feed_id " +
                        " WHERE " +
                        " MATCH (feed_history.title,feed_history.description_text) AGAINST ('" + ws + "' IN NATURAL LANGUAGE MODE) LIMIT 100";

                    // shorter than 4 characters...
                    if (useFullTextSearch === false) {
                        sql = "SELECT feed_history.title, feed_history.description, feed_history.description_text, feed_history.datepub, feed.title AS titleRSS " +
                            " FROM feed JOIN feed_history ON feed.feed_id = feed_history.feed_id " +
                            " WHERE " +
                            " (feed_history.title LIKE " + titles + ") OR (feed_history.description LIKE " + description + ")" +
                            " ORDER BY feed_history.datepub DESC LIMIT 100";
                    }

                    //console.log(sql);
                    mysqlPool.query(sql, function(error, rows) {
                        if (error) {
                            throw new Error(error);
                        }
                        if (rows.length === 0) {
                            res.send("");
                        } else {
                            var data = {feeds: rows};
                            res.send(rows);
                        }
                    });

                    break;


                case "view_collaborate":

                    var objUser = req.session.user || undefined;
                    if (objUser === undefined || objUser.role !== "administrator") {
                        res.redirect("/");
                        return null;
                    }

                    var channel = req.body.channel || "";
                    var title = req.body.title || "";
                    var description = req.body.description || "";
                    var meta = req.body.meta || "";
                    var image = req.body.image || "";
                    var instruction = req.body.instruction || "";
                    instruction = functions.truncate(instruction, 1000);
                    var countdown = req.body.time || 120;
                    var format = req.body.format || "";

                    new Promise(function (resolve, reject) {

                        mysqlPool.query(feedCollaborateChannel.insert,[{channel: channel, title: title, description: description, image: image, meta: meta, instruction: instruction, countdown: countdown, format: format}], function(error, result) {
                            if (error) { throw new Error(error); }
                            resolve(result);
                        });

                    }).then(function (data) {

                        data = {
                            success: true,
                            message: "done",
                            feedCollaborateChannelId: data.insertId
                        };

                        res.send(JSON.stringify(data));
                    });

                    break;

                case "ajax_view_edit":

                    var feedId = req.body.id || 0;
                    var feedViewId = req.body.feedViewId || 0;
                    var todo = req.body.todo || "";

                    if(feedId > 0 && feedViewId > 0) {
                        //check if already exists...

                        switch(todo) {

                            case "add":

                                mysqlPool.query(feedViewMember.selectMatch, [feedViewId, feedId], function(error, result) {

                                    if (error) { throw new Error(error); }

                                    if (result.length === 0) {

                                        mysqlPool.query(feedViewMember.insert, [{feed_view_id: feedViewId, feed_id: feedId}], function(error, result) {

                                            if (error) { throw new Error(error); }

                                            data = {
                                                success: true,
                                                message: "done",
                                                userId: result.insertId
                                            };

                                            res.send(JSON.stringify(data));
                                        });

                                    } else {
                                        data = {
                                            success: false,
                                            message: "RSS stream already in view"
                                        };

                                        res.send(JSON.stringify(data));
                                    }

                                });

                                break;

                            case "remove":

                                mysqlPool.query(feedViewMember.deleteId, [feedViewId, feedId], function(error, result) {

                                    if (error) { throw new Error(error); }

                                    data = {
                                        success: true,
                                        message: "done"
                                    };

                                    res.send(JSON.stringify(data));
                                });

                                break;
                        }
                    }

                    break;

            }
        }
    });

router.route("/ajax")
    .post(function(req, res) {

        var link = req.body.link || "";

        // check if user exists
        mysqlPool.query(user.selectEmail, email, function(error, result) {

            if (error) {
                throw new Error(error);
            }

            res.send(JSON.stringify(data));
        });
    });

module.exports = router;

