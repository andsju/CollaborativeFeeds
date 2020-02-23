var siege = require("siege");

siege()
    .on(3000)
    .for(100).times
    .get('/')
    .attack();
