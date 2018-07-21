let fs = require('fs'),
path = require('path');

// use fs.readDir to get the contents of the given dir
let readDir = function (dir) {

    return new Promise((resolve, reject) => {

        fs.readdir(dir, function (e, contents) {

            if (e) {

                reject(e)

            } else {

                resolve(contents);

            }

        });

    });

};

// get the stats of the given item path
let readStats = function (itemPath) {

    return new Promise((resolve, reject) => {

        fs.stat(itemPath, function (e, stats) {

            if (e) {

                reject(e)

            } else {

                resolve(stats);

            }

        });

    });

};

// what to do for all items
let forAllItems = function (opt, items) {

    items.forEach(function (item) {

        forItem(opt, item);

    });

};

// what to do for a single item
let forItem = function (opt, item) {

    let itemPath = path.join(opt.root, item);

    // read stats
    readStats(itemPath).then(function (stats) {

        console.log(itemPath);

        // if dir
        if (stats.isDirectory()) {

            walk(itemPath);

        }

    }).catch (function (e) {

        console.log(e);

    });

};

// walk
let walk = function (opt, forItem) {

    // if opt is a string
    if (typeof opt === 'string') {

        opt = {

            root: opt

        };

    }

    opt = opt || {};

    opt.root = opt.root || process.cwd();
    opt.level = opt.level || 0;
    opt.maxLevel = opt.maxLevel || -1;
    opt.forItem = opt.forItem || forItem || function (item) {
        console.log(item);
    };

    // read dir, and call forAll items
    readDir(opt.root).then(function (items) {

        forAllItems(opt, items);

    }).catch (function (e) {

        console.log(e);

    });

};

walk(process.cwd());
