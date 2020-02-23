/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var user = require("../models/user_model.js");

var data;

router.route("")
    .get(function(req, res) {
        var objUser = req.session.user || undefined;
        if (objUser === undefined) {
            res.redirect("/");
            return null;
        }
        var data = { success: "", message: "", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/createview", data);
    });

module.exports = router;
