// just using fs, and path
let fs = require('fs'),
path = require('path');

// a simple walk method
let walk = function (dir) {

    // get the contents of dir
    fs.readdir(root, (e, items) => {

        // for each item in the contents
        items.forEach((item) => {

            // get the item path
            let itemPath = path.join(dir, item);

            // get the stats of the item
            fs.stat(itemPath, (e, stats) => {

                // Just log the item path for now
                console.log(itemPath);

                // for now just use stats to find out
                // if the current item is a dir
                if (stats.isDirectory()) {

                    // if so walk that too, by calling this
                    // method recursively
                    walk(itemPath);

                }

            });

        });

    });

};

walk(process.cwd());
