/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

function getTime() {
    var time = new Date();
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

function getChannel() {
    var text = "";
    var string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i += 1) {
        text += string.charAt(Math.floor(Math.random() * string.length));
    }
    return text;
}

function truncate(s, n) {
    var str = s.length > n - 3 ? s.substr(0, n - 3) + "..." : s;
    return str;
}

function toSimplifiedISOString(date) {
    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        ' ' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds());
}

module.exports = {
    getTime: getTime,
    getChannel: getChannel,
    truncate: truncate,
    toSimplifiedISOString: toSimplifiedISOString
};
