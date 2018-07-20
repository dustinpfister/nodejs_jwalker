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

// get the stats
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

            let nextDepth = curDepth + 1,
            api = {
                path: path.join(dir, item),
                fs: fs,
                item: {}
            };

            // read stats
            readStats(api.path).then(function (stats) {

                api.isDir = stats.isDirectory();
                api.stats = stats;
                api.level = curDepth;
                api.content = null;
                api.fs = fs;

                // call forItem
                if (opt.read) {

                    // read contents
                    fs.readFile(api.path, function (e, data) {

                        if (data) {
                            api.data = data;
                            opt.forItem.call(api, api);

                        }

                    });

                } else {

                    // else just give the item
                    opt.forItem.call(api, api);

                }

                // if dir
                if (stats.isDirectory()) {

                    if (curDepth < maxDepth || maxDepth === -1) {

                        readDirRecursive(opt, api.path, nextDepth, maxDepth);

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
