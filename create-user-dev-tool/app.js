const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
var router = express.Router();

//Express route handler
require('./server/routes-handler')(app);

app.use(express.static('dist/create-user-dev-tool/'));

app.get("*", (req, res)=> {
    var options = {
        root: path.join(__dirname, "dist/create-user-dev-tool/")
    }
    return res.sendFile('index.html', options);
})

app.listen(port, ()=> console.log('app is running'));