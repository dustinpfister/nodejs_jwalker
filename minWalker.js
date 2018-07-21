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
let forAllItems = function (root, items) {

    items.forEach(function (item) {

        forItem(root, item);

    });

};

// what to do for a single item
let forItem = function (root, item) {

    let itemPath = path.join(root, item);

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
let walk = function (root) {

    readDir(root).then(function (items) {

        forAllItems(root, items);

    }).catch (function (e) {

        console.log(e);

    });

};

walk(process.cwd());
