let jWalk = require('./index.js');

//jWalk({root:'./',depth:2});

jWalk('./', function (item) {

    console.log(item.path);

});
