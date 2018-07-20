let fs = require('fs'),
path = require('path');

// read a dir using fs.readdir
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

// read dir recursive
let readDirRecursive = function (opt, dir, curDepth, maxDepth) {

    readDir(dir).then(function (items) {

        items.forEach(function (item) {

            let itemPath = path.join(dir, item),
            nextDepth = curDepth + 1;

            // read stats
            readStats(itemPath).then(function (stats) {

                // call forItem
                opt.forItem({

                    path: itemPath,
                    dir: stats.isDirectory(),
                    stats: stats

                });

                // if dir
                if (stats.isDirectory()) {

                    if (curDepth < maxDepth || maxDepth === -1) {

                        readDirRecursive(opt, itemPath, nextDepth, maxDepth);

                    }

                }

            });

        })

    })

};

module.exports = function (opt, forItem) {

    opt = opt || {};

    // if opt is a string
    if (typeof opt === 'string') {

        // that is the same as calling with and object
        // like this
        opt = {
            root: opt
        };

    }

    // resolve opt.root to an absolute path
    opt.root = path.resolve(opt.root || process.cwd());

    // depth defaults to -1 for unlimited recursion
    opt.depth = opt.depth || -1;

    // set forItem method
    opt.forItem = opt.forItem || forItem || function (item) {
        console.log(item);
    };

    // start recursive read
    readDirRecursive(opt, opt.root, 0, opt.depth);

};
