'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({

    route: {
        type: String
    },
    fullPath: {
        type: String
    },
    name: {
        type: String,
        unique: true
    }
});




mongoose.model('Image', schema);
