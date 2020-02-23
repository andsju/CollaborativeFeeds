/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
// database MySQL
var user = require("../models/user_model.js");

var data;

router.route("/")
    .get(function(req, res) {
        var objUser = req.session.user || "";
        var data = { success: "", message: "", token: "user", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/teaser", data);
    });

module.exports = router;
