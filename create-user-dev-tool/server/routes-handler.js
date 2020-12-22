const user = require('./create-user');

module.exports = function (app) {
    app.get('/create-user', user.createUser);
}