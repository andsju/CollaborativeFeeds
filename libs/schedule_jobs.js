/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var schedule = require("node-schedule");
var mysqlPool = require("../configs/db.js");
var feed = require("../models/feed_model.js");
var rss = require("../libs/rss.js");

function saveFeedsInterval(cronRule) {

    cronRule = cronRule || "*/30 * * * *";
    var j = schedule.scheduleJob(cronRule, function(){

        mysqlPool.query(feed.selectAll, function(error, rows, fields) {

            if (error) {
                console.log(error);
            }

            if (rows) {
                console.log(rows);
                console.log(rows.length);

                for (var i = 0; i < rows.length; i += 1) {
                    console.log(rows[i].link);
                    //rss.get(rows[i].link, rows[i].feed_id);
                    var check = false;
                    rss.getFeed(rows[i].link, rows[i].feed_id, check);
                }
            }
        });

    });
}

function saveFeedHistory(id) {

    mysqlPool.query(feed.selectId, id, function(error, rows) {

        if (error) {
            console.log(error);
        }

        if (rows) {
            var check = false;
            // rss.get(rows[0].link, rows[0].feed_id);
            rss.getFeed(rows[0].link, rows[0].feed_id, check);
        }
    });

}

module.exports = {
    saveFeedsInterval: saveFeedsInterval,
    saveFeedHistory: saveFeedHistory
}
