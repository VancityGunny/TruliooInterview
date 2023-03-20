const express = require('express');
const bodyParser = require('body-parser');
const User = require('./login_modules/user');
const auth = require('./login_modules/auth_helper');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// TODO: these endpoint should have their own controller and not here in the default
app.post('/api/register', 
    auth.validateRegister,
    (req, res) => {
    // read body and create new user
    // automatically login
    return auth.registerNewUser(req,res);    
});

app.post('/api/login', (req, res) => {
    // login user
    return auth.login(req,res);    
});


// Start the server
var server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

module.exports = server;