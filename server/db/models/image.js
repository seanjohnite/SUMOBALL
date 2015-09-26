'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({

    path: {
        type: String
    },
    name: {
        type: String
    }
});




mongoose.model('Image', schema);
