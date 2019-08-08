const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.resolve('dist')));

//监听端口为3000
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://localhost:%s', port);
});
