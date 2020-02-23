/**
 * @author andsju
 * @version 1.0.0
 */

"use strict";

/*
module.exports = {

    sessionName: "ExpressServerSession",
    sessionSecret: "NHR96SK3QCP35UGUNCLY4YQR"

};
*/

module.exports = require("./" + (process.env.NODE_ENV || "development") + ".json");
