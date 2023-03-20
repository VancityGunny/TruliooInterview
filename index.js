const express = require('express');

const User = require('./login_modules/user');
const app = express();
const port = 3000;

app.post('/api/register', (req, res) => {
    // read body and create new user
    // automatically login
    res.status(200).json({ message: 'successfully registered'});
});

app.post('/api/login', (req, res) => {
    // login user
    res.status(200).json({ message: 'successfully login'});
});


// Start the server
var server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

module.exports = server;