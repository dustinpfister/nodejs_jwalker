let jWalk = require('./index.js');


jWalk('./', function (item) {

    console.log(item.level + ':' + item.path);

});
