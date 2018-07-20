let fs = require('fs');

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

}

module.exports = function (opt) {

    opt = opt || {};

    opt.root = opt.root || process.cwd();

    readDir(opt.root).then(function (items) {

        console.log(items);

    })

};
