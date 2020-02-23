/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var validate = require("../libs/validate");
var user = require("../models/user_model.js");


router.route("/")
    .get(function(req, res) {
        var data = {user: "Hugge", csrfToken: req.csrfToken()};
        res.render("pages/template", data);

    });

router.route("/")
    .post(function(req, res) {

        console.log("protocol: " + req.protocol);
        console.log("secure: " + req.secure);
        console.log("ip: " + req.ip);
        console.log("hostname: " + req.hostname);
        console.log("path: " + req.path);
        console.log("url: " + req.url);

        console.log("headers: " + req.headers);
        console.log("route: " + req.route);
        console.log("params: " + req.params);
        console.log("query: " + req.query);

        // only response to ajax request
        if(req.xhr) {
            res.json({success: true});
        }

    });

module.exports = router;
