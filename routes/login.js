/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var data;

router.route("/")
    .get(function(req, res) {
        var objUser = req.session.user || undefined;
        data = { success: "", message: "", token: "user", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/login", data);
    });

module.exports = router;
