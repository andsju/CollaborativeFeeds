/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var passwordHash = require("password-hash");
var user = require("../models/user_model.js");

var data;

router.route("/")
    .get(function(req, res) {

        var objUser = req.session.user || undefined;
        if (objUser === undefined) {
            res.redirect("/");
            return null;
        }

        var data = { success: "", message: "", token: "user", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/user", data);
    });

router.route("/login")
    .get(function(req, res) {

        var objUser = req.session.user || undefined;
        var data = { success: "", message: "", token: "user", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/login", data);
    });

router.route("/logout")
    .get(function(req, res) {

        var objUser = undefined;
        var data = { success: "", message: "", token: "user", user: objUser, csrfToken: ""};
        req.session.destroy();
        res.redirect("/");
    });

router.route("/ajax")
    .post(function(req, res) {

        var email = req.body.email || "";
        var password = req.body.password || "";

        // validate
        if (validate.validate(email, "email") && validate.isPassword(password)) {

            console.log("A");
            // check if user exists
            mysqlPool.query(user.selectEmail, email, function(error, result) {

                if (error) { throw new Error(error); }

                console.log("B");
                if (result.length > 0) {

                    console.log("C");
                    if (passwordHash.verify(password, result[0].password)) {
                        console.log("D");
                        // set session
                        req.session.user = {id: result[0].user_id, email: result[0].email, role: result[0].role, channel: ""};
                        data = {
                            success: true,
                            message: "Welcome back"
                        };

                    } else {
                        console.log("E");
                        data = {
                            success: false,
                            message: "Login failed"
                        }
                    }

                    console.log("F");
                    res.contentType("json");
                    res.send(JSON.stringify(data));
                } else {
                    console.log("G");
                    data = {
                        success: false,
                        message: "User not registered"
                    }
                    res.contentType("json");
                    res.send(JSON.stringify(data));

                }
            });

        } else {

            data = {
                success: false,
                message: "Login failed"
            }
            res.contentType("json");
            res.send(JSON.stringify(data));
        }
    });

module.exports = router;
