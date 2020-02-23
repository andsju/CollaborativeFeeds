/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var router = require("express").Router();
var validate = require("../libs/validate");
var Q = require("q");
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

        new Promise(function (resolve, reject) {

            mysqlPool.query(user.selectAll, function(error, result) {
                if (error) { throw new Error(error); }
                resolve(result);
            });

        }).then(function (data) {
            var data = {user: objUser, csrfToken: req.csrfToken(), users: data, form: false};
            res.render("pages/users", data);
        });
    });

router.route("/:id")
    .get(function(req, res) {

        var objUser = req.session.user || undefined;
        var id = req.params.id || "";

        if (objUser === undefined || objUser.role !== "administrator") {
            res.redirect("/");
            return null;
        }

        new Promise(function (resolve, reject) {

            mysqlPool.query(user.selectUserId, id, function(error, result) {
                if (error) { throw new Error(error); }
                console.log("B");
                console.log("result", result);
                resolve(result);
            });

        }).then(function (data) {
            var data = {user: objUser, csrfToken: req.csrfToken(), users: data, form: true, flash: ""};
            console.log("data", data);
            res.render("pages/users", data);
        });

    });

router.route("/:id")
    .post(function(req, res) {

        var objUser = req.session.user || undefined;
        var id = req.params.id || 0;
        var role = req.body.role || "";
        var csrfToken = req.body.role || "";

        if (objUser === undefined || objUser.role !== "administrator") {
            res.redirect("/");
            return null;
        }
        new Promise(function (resolve, reject) {

            mysqlPool.query(user.updateId, [{role: role}, id], function(error, result) {
                if (error) { throw new Error(error); }
                resolve(result);
            });

        }).then(function (data) {

            new Promise(function (resolve, reject) {
                mysqlPool.query(user.selectUserId, id, function(error, result) {
                    if (error) { throw new Error(error); }
                    resolve(result);
                });
            }).then(function (data) {
                req.session.flash = "Saved";
                var data = {user: objUser, csrfToken: req.csrfToken(), users: data, form: true, flash: req.session.flash};
                res.render("pages/users", data);
            });

        });

    });

module.exports = router;
