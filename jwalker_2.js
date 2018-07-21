let fs = require('fs'),
path = require('path');

// use fs.readDir to get the contents of the given dir
let readDir = (dir) => {

    return new Promise((resolve, reject) => {

        fs.readdir(dir, (e, contents) => {

            if (e) {

                reject(e)

            } else {

                resolve(contents);

            }

        });

    });

};

// get the stats of the given item path
let readStats = (itemPath) => {

    return new Promise((resolve, reject) => {

        fs.stat(itemPath, (e, stats) => {

            if (e) {

                reject(e)

            } else {

                resolve(stats);

            }

        });

    });

};

// what to do for all items
let forAllItems = (opt, items) => {

    items.forEach((item) => {

        forItem(opt, item);

    });

};

// what to do for a single item
let forItem = (opt, item) => {

    let itemPath = path.join(opt.root, item);

    // read stats
    readStats(itemPath).then((stats) => {

        // the api
        let api = {

            opt: opt,
            fs: fs,

            // read file convenience method
            read: function (cb) {

                let api = this;

                return fs.readFile(api.item.path, (e, data) => {

                    if (e) {

                        cb(e, null);

                    }

                    if (data) {

                        let ext = api.item.ext;

                        if (ext === '.js' || ext === '.html' || ext === '.css') {

                            data = data.toString();

                        }

                        cb(null, data);

                    }

                });

            },
            item: {

                path: itemPath,
                filename: item,
                ext: path.extname(item).toLowerCase(),
                isDir: stats.isDirectory()

            }

        };

        opt.onItem.call(api, api.item);

        // find next level
        let nextLevel = opt.level + 1;

        // if level is less than maxLevel, or the no maxLevel flag of -1 is set
        if (opt.level < opt.maxLevel || opt.maxLevel === -1) {

            // if dir
            if (stats.isDirectory()) {

                walk(Object.assign({}, opt, {
                        root: itemPath,
                        level: nextLevel
                    }));

            }

        }

    }).catch ((e) => {

        opt.onError.call(opt, e, item);

    });

};

// walk
let walk = (opt, onItem, onError) => {

    // if opt is a string
    if (typeof opt === 'string') {

        opt = {

            root: opt

        };

    }

    opt = opt || {};
    opt.root = path.resolve(opt.root || process.cwd());
    opt.level = opt.level === undefined ? 0 : opt.level;
    opt.maxLevel = opt.level === undefined ? -1 : opt.maxLevel;
    opt.onItem = opt.onItem || onItem || function (item) {
        console.log(item);
    };
    opt.onError = opt.onError || onError || function (e) {

        console.log(e);

    };

    // read dir, and call forAll items
    readDir(opt.root).then(function (items) {

        forAllItems(opt, items);

    }).catch ((e) => {

        opt.onError.call(opt, e);

    });

};

/*
walk('./', function (item) {

console.log('level: ' + this.opt.level + ' : ' + item.filename)

});
 */

walk('./', function (item) {

    // only log javaScript files
    if (item.ext === '.js') {

        this.read(function (e, js) {

            if (js) {

                console.log(js);

            }

        });

    }

});

/*
walk({

root: './',
maxLevel: 0,
onItem: function (item) {

//console.log('level: ' + this.opt.level + ' : ' + item.filename)

console.log('********** item **********');
console.log(this.opt);
console.log(this.item);
console.log('********** **** **********');

},
onError: function (e, item) {

console.log('********** ERROR **********');

console.log(e.message);

if (item) {

console.log(item);

}

console.log('********** ***** **********');

}

});
*/
