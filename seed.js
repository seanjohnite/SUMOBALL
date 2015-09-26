/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Image = Promise.promisifyAll(mongoose.model('Image'));

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

var seedImages = function () {

    var images = [
        {
            route: '/images/gabriel_lebec@2x.jpg',
            name: 'gabe'
        },
        {
            route: '/images/david_yang@2x.jpg',
            name: 'david'
        },
        {
            route: '/images/joe_alves@2x.jpg',
            name: 'joe'
        },
        {
            route: '/images/nimit_maru@2x.jpg',
            name: 'nimit'
        },
        {
            route: '/images/omri_bernstein@2x.jpg',
            name: 'omri'
        },
        {
            route: '/images/scott_dalessandro@2x.jpg',
            name: 'scott'
        },
        {
            route: '/images/zeke_nierenberg@2x.jpg',
            name: 'zeke'
        },
        {
            route: '/images/flask22.png',
            name: 'flask'
        }
    ];

    images = images.map(image => {
        image.fullPath = '/Users/sean/Programming/Fullstack/week_nine/sumoball/browser/' + image.route;
        return image;
    });

    return Image.createAsync(images);

};

connectToDb.then(function () {
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        console.log('seeding images');
        return seedImages();
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
