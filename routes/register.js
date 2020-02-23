/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var passwordHash = require("password-hash");
var validate = require("../libs/validate");
var mysqlPool = require("../configs/db.js");
var user = require("../models/user_model.js");

var data;

router.route("")
    .get(function(req, res) {
        var objUser = req.session.user || "";
        var data = { success: "", message: "", token: "registertodilooo", user: objUser, csrfToken: req.csrfToken()};
        res.render("pages/register", data);
    });

router.route("/ajax")
    .post(function(req, res) {

        var email = req.body.email || "";
        var password = req.body.password || "";

        // validate
        if (validate.validate(email, "email") && validate.isPassword(password)) {

            // check if user exists
            mysqlPool.query(user.selectEmail, email, function(error, result) {

                if (error) {
                    throw new Error(error);
                }

                if (result.length == 0) {

                    // hash password
                    var hashedPassword = passwordHash.generate(password);
                    // insert new user
                    mysqlPool.query(user.insert, [{email: email, password: hashedPassword, role: "user"}], function(error, result) {

                        if (error) {
                            throw new Error(error);
                        }

                        data = {
                            success: true,
                            message: "User registered successfully",
                            userId: result.insertId,
                            email: email,
                            token: req.sessionID
                        };
                        res.send(JSON.stringify(data));
                    });

                } else {

                    data = {
                        success: false,
                        message: "User is already registered",
                        userId: "",
                        email: email,
                        token: req.sessionID
                    };
                    res.send(JSON.stringify(data));
                }

            });

        } else {

            console.log("Validation failed");

        }
    });

module.exports = router;

