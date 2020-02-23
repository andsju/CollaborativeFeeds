/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

var FeedParser = require("feedparser");
var request = require("request");
var striptags = require("striptags");
var mysqlPool = require("../configs/db.js");
var mysql = require("mysql");
var feedHistory = require("../models/feed_history_model.js");
var functions = require("../libs/functions");
var validate = require("../libs/validate");
var iconv = require('iconv-lite');


function getChannel(uri) {
    return Promise.resolve().then(function () {
        var check = true;
        var id = 0;
        return getFeed(uri, id, check);
    }).then(function (result) {
        //console.log("result", result);

        return result;
    }).catch(function (err) {
        console.log("An error");
        console.log(err);
    });
}

function getFeed(feed, id, check) {

    var feedparser = new FeedParser();
    return new Promise(function (resolve, reject) {
        // request
        // resolve on response
        // reject no response

        var req = request(feed, {
            timeout: 10000,
            pool: false
        });
        req.setMaxListeners(50);

        // some feeds do not respond without user-agent and accept headers
        req.setHeader('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
        req.setHeader('accept', 'text/html,application/xhtml+xml');

        req.on('error', (err) => reject(err));

        req.on('response', function (res) {
            // console.log("res.statusCode", res.statusCode);
            if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

            // check media type if we need to decode compressed data (return gzip|compress|deflate)
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
            var encoding = res.headers['content-encoding'] || 'identity';
            res = maybeDecompress(res, encoding);
            
            // get charset specified in headers content-type 
            var charset = getParams(res.headers['content-type'] || '').charset;     
            charset = typeof charset === "undefined" ? charset : charset.toLowerCase();
            res = maybeTranslate(res, charset);

            resolve(res.pipe(feedparser));
        });

    }).then(function (result) {

        return new Promise(function (resolve, reject) {

            result.on('error', (err) => reject(err));
            result.on('end', (e) => resolve("OK", e));

            result.on('readable', function () {

                // just validate rss feed
                if (check) {
                    
                    var meta = this.meta;
                    var data = {};
                    data.title = meta.title;
                    data.description = meta.description;
                    data.language = meta.language;
                    data.link = meta.link;
                    data.success = true;
                    data.message = "Stream validated";
                    if (meta.image) {
                        Object.entries(meta.image).forEach(([key, value]) => {
                            if (key == "url") {
                                data.imageUrl = value;
                            }
                            if (key == "title") {
                                data.imageTitle = value;
                            }
                        });
                    }

                    resolve(data);
                }

                // save feed items when function called and variable check is false
                if (!check){
                    var item;
                    while (item = this.read()) {
                        saveHistory(item, id);
                    }    
                }
            });

        });

    }).catch(function (result) {
        console.log("FAIL");
        console.log("Catch result", result);

        var data = {};
        data.success = false;
        data.messsage = "RSS feed not found";
        
        return data;
    });
}

/*
function get(feed, id) {

    var req = request(feed, {
        timeout: 10000,
        pool: false
    });

    var check = false;
    return getFeed(feed, id, check);
}
*/

function maybeDecompress(res, encoding) {
    var decompress;
    if (encoding.match(/\bdeflate\b/)) {
        decompress = zlib.createInflate();
    } else if (encoding.match(/\bgzip\b/)) {
        decompress = zlib.createGunzip();
    }
    return decompress ? res.pipe(decompress) : res;
}

function maybeTranslate(res, charset) {

    console.log("maybe translate charset", charset);
    if (charset && !/utf-*8/i.test(charset)) {
        // console.log("translating...............");
        try {
            iconv = require('iconv-lite');
            // console.log('Converting from charset %s to utf-8', charset);
            res = res.pipe(iconv.decodeStream(charset)).pipe(iconv.encodeStream('utf-8'));
        } catch (err) {
            // console.log("ooooooopsssss....");
            res.emit('error', err);
        }
    }

    return res;
}

function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) {
            return part.trim();
        });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}


function saveHistory(item, id) {

    // loop each feed
    // STEP 1
    // delete from database saved history older than settings in feed:days_before_delete
    // STEP 2
    // insert || update ?
    // if link exists update post title / description / image
    mysqlPool.query(feedHistory.updateLink, [{
        title: item.title,
        description: item.description,
        description_text: striptags(item.description),
        datepub: item.date
    }, item.link], function (error, result) {

        if (error) {
            // console.log("feedHistory.updateLink" + item.title + ", " + item.date + ", " + item.link);
            console.log(error);
        }

        if (result) {

            // STEP 3
            // if not resultUpdate -> new feed_history to insert
            if (result.affectedRows == 0) {

                // in RSS specifikation date is not required, in database date is required
                item.date = validate.isDate(item.date) ? item.date : new Date();

                //console.log("to be posted: " + post.title + ", " + post.date + ", " + validate.isDate(post.date));
                //post.date = functions.toSimplifiedISOString(post.date);
                // console.log("insertHistory: " + item.title, item.date);
                /*
                for (var prop in item) {
                    console.log(`item.${prop} = ${item[prop]}`);
                }
                */

                insertHistory(item, id);
            }
        }
    });
};

function insertHistory(post, id) {

    mysqlPool.query(feedHistory.insert, [{
        feed_id: id,
        link: post.link,
        title: post.title,
        description: striptags(post.description, ['p', 'div', 'br', 'a', 'b', 'strong', 'i', 'blockquote', 'img']),
        description_text: striptags(post.description),
        datepub: post.date
    }], function (error, result) {

        if (error) {
            // console.log("feedHistory.insert fail:" + post.title + ", " + post.date);
            console.log(error);
        }

        if (result) {
            console.log("feedHistory.insert ok:" + post.title + ", " + post.date);
            console.log(result);
        }
    });

};

module.exports = {
    getFeed: getFeed,
    getChannel: getChannel
};
