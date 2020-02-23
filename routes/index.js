/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var mysqlPool = require("../configs/db.js");
var feedView = require("../models/feed_view_model.js");

var data;

router.route("/")
    .get(function(req, res) {

        var objUser = req.session.user || undefined;

        // https://www.npmjs.com/package/mysql#pooling-connections
        // https://github.com/felixge/node-mysql/issues/857#issuecomment-47382419
        // single statement queries use pool directly, the connection is released by default
        // teaser, 5 sec delay and then som random feeds displayed

        if (objUser !== undefined) {
            mysqlPool.query(feedView.selectAll, [objUser.id], function(error, rows, fields) {

                if (error) { throw new Error(error); }

                if (rows.length === 0) {
                    data = {user: objUser, csrfToken: req.csrfToken()};
                    res.render("pages/createview", data);

                } else {
                    data = {feedView: rows, user: objUser, csrfToken: req.csrfToken()};
                    res.render("pages/index", data);
                }

            });

        } else {
            var rows = [];
            data = {feedView: rows, user: objUser, csrfToken: req.csrfToken()};
            res.render("pages/index", data);
        }

    });

module.exports = router;
