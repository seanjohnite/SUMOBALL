'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var path = require('path');

var ObjectId = mongoose.Types.ObjectId;

module.exports = router;

var uniq = function (filename) {
    var ext = path.extname(filename);
    var base = path.basename(filename, ext);
    return `${base}${ObjectId().toString()}${ext}`;
};

router.post('/', multipartyMiddleware, function (req, res, next) {
    var uniqueName = uniq(req.files.file.name);
    console.log(uniqueName);
    var newFilePath = path.resolve(__dirname + '../../../../../browser/images/' + uniqueName);
    console.log(newFilePath);
    fs.readFileAsync(req.files.file.path)
    .then(function (contents) {
        return fs.writeFileAsync(newFilePath, contents);
    })
    .then(function () {
        var route = newFilePath.slice(60);
        console.log(route);
        return Image.create({
            fullPath: newFilePath,
            route,
            name: req.body.name
        });
    })
    .then(function (image) {
        res.status(201).send(image);
    })
    .then(null, function (err) {
        return fs.unlinkAsync(newFilePath)
        .then(function () {
            next(err);
        })
    });
});

router.get('/', function (req, res) {
    Image.find().exec()
    .then(function (images) {
        res.json(images);
    });
})
