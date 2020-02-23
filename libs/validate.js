/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

/**
 * Function to validate data
 *
 * @param data
 * @param type
 * @returns {boolean}
 */
function validate(data, type) {

    var pattern;
    type.toLowerCase();

    switch(type) {
        case "username" : // 4-8 length
            pattern = /^(?=.{4,8}$)[A-Za-z0-9]+$/;
            break;
        case "numbers" :
            pattern = /^[0-9]+$/;
            break;
        case "email" :
            // code from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            break;
        case "url" :
            // code from http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
            pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
            break;
        case "title" : // 2-20 length
            pattern = /^(?=.{2,100}$)[\s\wåäöÅÄÖ]+$/;
            break;
    }

    if (pattern === undefined) {
        return false;
    }

    return pattern.test(data);
}

/**
 * Function to validate data
 *
 * @param data
 * @param type
 * @returns {boolean}
 */
function isPassword(string) {

    var test1 = /[A-Z]/.test(string);
    var test2 = /[a-z]/.test(string);
    var test3 = /\d/.test(string);
    var test4 = string.length > 5 ? true : false;
    var result = test1 + test2 + test3 + test4 === 4 ? 1 : 0;

    return result;
}

function isDate(val) {
    if (val === null) {
        return false;
    }
    var d = new Date(val);
    return !isNaN(d.valueOf());
}


module.exports = {
    validate: validate,
    isPassword: isPassword,
    isDate: isDate
};
