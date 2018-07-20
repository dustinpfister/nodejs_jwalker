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
let readDirRecursive = function (dir, curDepth, maxDepth) {

    readDir(dir).then(function (items) {

        items.forEach(function (item) {

            let itemPath = path.join(dir, item),
            nextDepth = curDepth + 1;

            readStats(itemPath).then(function (stats) {

                // if dir
                if (stats.isDirectory()) {

                    if (curDepth < maxDepth || maxDepth === -1) {

                        readDirRecursive(itemPath, nextDepth, maxDepth);

                    }

                } else {

                    // if file

                    console.log(curDepth + ' + ' + itemPath);

                }

            });

        })

    })

};

module.exports = function (opt) {

    opt = opt || {};

    opt.root = path.resolve(opt.root || process.cwd());
    opt.depth = opt.depth || -1;

    readDirRecursive(opt.root, 0, opt.depth);

};
