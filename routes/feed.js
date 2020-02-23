/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var Q = require("q");
var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var rss = require("../libs/rss.js");
var FeedParser = require("feedparser");
var request = require("request");
var scheduleJobs = require("../libs/schedule_jobs.js");

// database models
var feed = require("../models/feed_model.js");
var feedHistory = require("../models/feed_history_model.js");

var data;

router.route("/")
    .get(function (req, res) {
        var objUser = req.session.user || undefined;

        function selectFeeds() {
            var defered = Q.defer();
            mysqlPool.query(feed.selectAll, defered.makeNodeResolver());
            return defered.promise;
        }

        function selectFeeds2() {
            return new Promise(function(resolve, reject) {

                mysqlPool.query(feed.selectLimit, 2, function (err, rows, fields) {

                    if (err) {
                        console.log("err....");
                        return reject(err);
                    }
                    console.log("resolve....");
                    console.log("rows....", rows.length);
                    //console.log("fields....", fields);
                    resolve(rows);
                });
            })
        }



        if (objUser !== undefined) {

            
            selectFeeds2().then(function(data) {
                console.log("data");
                //console.log(r);
            })
            .catch(function(err) {
                //console.log("Error catch: ", err);
                //throw err;
                console.log("An error....");
                throw new Error("A new error");
            })
            
    

            /*
            return Promise.resolve().then(function () {
                return mysqlPool.query(feed.selectAll);
            }).then(function (data) {
                console.log("data", data);
            })
           */

            /*
            pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
                console.log('The solution is: ', results[0].solution);
            });

            */


            

            Q.all([selectFeeds()]).then(function (results) {

                var data = {
                    user: objUser,
                    csrfToken: req.csrfToken(),
                    feeds: results[0][0]
                };
                res.render("pages/feed", data);
            });

        } else {
            res.redirect("/");
        }
    });


router.route("/ajax")
    .post(function (req, res) {

        var objUser = req.session.user || undefined;
        var id = req.body.id || 0;
        var title = req.body.title || "";
        var link = req.body.link || "";
        var category = req.body.category || "";
        var description = req.body.description || "";
        var language = req.body.language || "";
        var image_url = req.body.image_url || "";
        var image_title = req.body.image_title || "";
        var action = req.body.action || "";
        var data;

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


            case "delete":

                mysqlPool.query(feedHistory.deleteFeedId, id, function (error, result) {

                    if (error) {
                        throw new Error(error);
                    }

                    mysqlPool.query(feed.deleteId, id, function (error, result) {

                        if (error) {
                            throw new Error(error);
                        }

                        data = {
                            success: true,
                            message: "RSS deleted"
                        };
                        res.contentType("json");
                        res.send(JSON.stringify(data));
                    });
                });

                break;

            case "save":

                if (validate.validate(link, "url") && title.length > 0) {

                    if (id > 0) {

                        new Promise(function (resolve, reject) {

                            mysqlPool.query(feed.updateId, [{
                                title: title,
                                category: category,
                                description: description,
                                language: language,
                                image_url: image_url,
                                image_title: image_title
                            }, id], function (error, result) {

                                if (error) {
                                    throw new Error(error);
                                }

                                data = {
                                    success: true,
                                    message: "RSS saved successfully",
                                    link: link
                                };

                                scheduleJobs.saveFeedHistory(id);
                                resolve(data);
                            });

                        }).then(function (data) {

                            res.contentType("json");
                            res.send(JSON.stringify(data));
                        });
                    }

                    if (id == 0) {

                        new Promise(function (resolve, reject) {

                            mysqlPool.query(feed.selectLink, link, function (error, result) {

                                if (error) {
                                    throw new Error(error);
                                }
                                resolve(result);
                            });

                        }).then(function (result) {

                            if (result.length === 0) {

                                mysqlPool.query(feed.insert, [{
                                    title: title,
                                    link: link,
                                    category: category,
                                    description: description,
                                    language: language,
                                    image_url: image_url,
                                    image_title: image_title
                                    }], function (error, result) {

                                    if (error) {
                                        throw new Error(error);
                                    }

                                    data = {
                                        success: true,
                                        message: "RSS registered successfully",
                                        feedId: result.insertId,
                                        link: link
                                    };

                                    scheduleJobs.saveFeedHistory(data.feedId);
                                    res.contentType("json");
                                    res.send(JSON.stringify(data));
                                });

                            } else {

                                data = {
                                    success: false,
                                    message: "Link exists"
                                };
                                res.contentType("json");
                                res.send(JSON.stringify(data));
                            }

                        });

                    }

                }

                break;

        }

    });


router.route("/ajax_check")
    .post(function (req, res) {

        var link = req.body.link || "";
        console.log("link" + link);
        // check encoding using promise

        return Promise.resolve().then(function () {
            return rss.getChannel(link);
        }).then(function (data) {
            console.log("received data", data);
            //responseToRequest(res, data);

            res.contentType("json");
            res.send(JSON.stringify(data));
                
        })
        .catch(function (err) {
            console.log(err);
        });
        
    });

    function responseToRequest(data) {
        res.contentType("json");
        res.send(JSON.stringify(data));
    }

module.exports = router;
