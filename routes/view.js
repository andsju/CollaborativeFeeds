/**
 * @author andsju
 * @version 1.0.0
 * */

"use strict";

var router = require("express").Router();
var Q = require("q");
var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var user = require("../models/user_model.js");

var feed = require("../models/feed_model.js");
var feedView = require("../models/feed_view_model.js");
var feedViewMember = require("../models/feed_view_member_model.js");

var data;

router.route("/show/:id")
    .get(function(req, res) {

        var objUser = req.session.user || null;

        function selectFeeds(){
            var defered = Q.defer();
            mysqlPool.query(feed.selectAll, defered.makeNodeResolver());
            return defered.promise;
        }

        function selectFeedViews(){
            var defered = Q.defer();
            mysqlPool.query(feedView.selectView, [req.params.id, objUser.id], defered.makeNodeResolver());
            return defered.promise;
        }

        function selectFeedViewMembers(){
            var defered = Q.defer();
            mysqlPool.query(feedViewMember.selectJoin, [req.params.id], defered.makeNodeResolver());
            return defered.promise;
        }

        if (objUser !== null) {

            Q.all([selectFeeds(), selectFeedViews(), selectFeedViewMembers()]).then(function(results){

                var ids = results[2][0].map(function(item) {
                    return item['feed_id'];
                });

                var data = {user: objUser, csrfToken: req.csrfToken(), views: results[2][0], ids: ids, feeds: results[0][0], current: results[1][0]};
                res.render("pages/view", data);
            });

        } else {
            res.redirect("/");
        }
    });

router.route("/edit/:id")
    .get(function(req, res) {
        var objUser = req.session.user || null;

        function selectFeeds(){
            var defered = Q.defer();
            mysqlPool.query(feed.selectAll, defered.makeNodeResolver());
            return defered.promise;
        }
        function selectFeedViews(){
            var defered = Q.defer();
            mysqlPool.query(feedView.selectView, [req.params.id, objUser.id], defered.makeNodeResolver());
            return defered.promise;
        }
        function selectFeedViewMembers(){
            var defered = Q.defer();
            mysqlPool.query(feedViewMember.selectJoin, [req.params.id], defered.makeNodeResolver());
            return defered.promise;
        }

        if (objUser !== null) {

            Q.all([selectFeeds(), selectFeedViews(), selectFeedViewMembers()]).then(function(results){

                var data = {user: objUser, csrfToken: req.csrfToken(), feeds: results[0][0], viewCurrent: results[1][0], vievMembers: results[2][0]};
                res.render("pages/view_edit", data);
            });

        } else {
            res.redirect("/");
        }
    });

module.exports = router;
