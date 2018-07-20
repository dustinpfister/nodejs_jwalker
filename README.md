# jWalker

This is just another node.js file system walker like that of node-dir, klaw, and walk. With this walker the aim was to just make a quick, simple walker that just makes use of node.js built in modules only using just the fs, and path modules.


## 1 - simple example

I wanted to make this walker stupid simple so walking can be done just like this if need be.

```js
jWalk('./', function (item) {
 
    console.log(item.level + ':' + item.path);
 
});
```