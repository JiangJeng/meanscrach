"use strict"
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: '+err);
});


const app = express();

const users = require('./routes/users');

// Port Number
//const port = 3000;
const port = process.env.PORT || 8080;

// CORS MW
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

// Body Parser MW
app.use(bodyParser.json());

//Passport MW
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users',users);

// Index route
app.get('/',(req,res) => {
    res.send('Invalid Endpoint!');
});

//make sure that every route aside from the ones that we specified goes that index html file
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'public/index.html'));
});

app.listen(port,() =>{
 console.log('Server started on port '+ port);
});