/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

// required
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");

// ...
const https = require("https");

var config = require("./configs/config.js");
var scheduleJobs = require("./libs/schedule_jobs.js");

// schedule jobs maintaining data
//scheduleJobs.saveFeedsInterval("*/60 * * * *");
//scheduleJobs.saveFeedsInterval("* * /1 * * *");
//scheduleJobs.saveFeedsInterval("*/10 * * * *");

/* --------------------------------------------------
 app environment
 -------------------------------------------------- */
var app = express();

// sessions
app.use(session({
    secret: config.session.sessionSecret,
    name: config.session.sessionName,
    resave: false,
    saveUninitialized: true
}));

// handle forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// support flash messages
app.use(function(req, res, next) {
    if (req.session.flash) {
        res.locals.flash = req.session.flash;
        delete req.session.flash;
    }
    next();
});

// CSRF protection
app.use(require("csurf")());
app.use(function(req, res, next) {
    res.locals._csrfToken = req.csrfToken();
    next();
});

// static resources
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("view engine", "ejs");

/* --------------------------------------------------
 test...
 -------------------------------------------------- */
app.use(function(req, res, next) {
    if (req.session.user) {
        // some test
    }
    next();
});

/* --------------------------------------------------
 routes
 -------------------------------------------------- */
app.use("/", require("./routes/index.js"));
app.use("/initiate", require("./routes/initiate.js"));
app.use("/user", require("./routes/user.js"));
app.use("/users", require("./routes/users.js"));
app.use("/register", require("./routes/register.js"));
app.use("/login", require("./routes/login.js"));
app.use("/feed", require("./routes/feed.js"));
app.use("/createview", require("./routes/createview.js"));
app.use("/view", require("./routes/view.js"));
app.use("/collaborate", require("./routes/collaborate.js"));
app.use("/view_ajax", require("./routes/view_ajax.js"));
app.use("/teaser", require("./routes/teaser.js"));
app.use("/template", require("./routes/template.js"));

/* --------------------------------------------------
 errors
 -------------------------------------------------- */
app.get("*", function(req, res, next) {
    var err = new Error();
    err.status = 404;
    res.render("pages/404");
    next();
});

app.use(function(err, req, res, next) {
    err.status = 500;
    res.status(500).send("Internal error!");
});

/* --------------------------------------------------
 server
 -------------------------------------------------- */
var http = require("http");
var port = process.env.PORT || 8000;

// start server
var server = http.createServer(app).listen(port, function() {
    console.log("Express started in " + app.get("env") + " mode on https://localhost:" + port);
    console.log("Press Ctrl-C to terminate...");
});

var io = require("socket.io")(server);

io.on("connection", function(socket){

    // receive emit events server-side
    socket.on("new login", function(data) {
        socket.email = data.email;
        var message = "Logged in: " + socket.email;
        io.emit("login", {message: message});
    });

    socket.on("new channel", function(data) {
        var message = "Join";
        socket.channel = data.channel;
        io.emit("channel", {message: message, channel: data.channel});
    });

    socket.on("new task", function(data) {
        io.emit("task", {rss: data.rss});
    });

    socket.on("new response", function(data) {
        io.emit("response", {rss: data.rss});
    });
});
