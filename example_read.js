let jWalk = require('./index.js');

jWalk({
    root: './',
    read: true
}, function (item) {

    console.log(item.level + ':' + item.path);
    console.log(item.data);

});