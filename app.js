// const fs = require('fs');
const express = require ('express'); //[MASOK]
const expressLayouts = require ('express-ejs-layouts'); //[MASOK]
const path = require('path');
const { body, validationResult, check } = require ('express-validator');
const mongoose = require ('mongoose');
const passport=require('passport');
const methodOverride = require('method-override');

const session = require ('express-session'); //[MASOK]
// const cookieParser = require ('cookie-parser');
const flash = require ('connect-flash'); //[MASOK]

// passport config
require('./config/passport')(passport);

//DB CONFIG and conenct mongo
require ('./config/db');
const user = require ('./model/user');
const project = require ('./model/project');
const { config } = require('process');

const app = express();
const port = 3000;

//setup method override
app.use(methodOverride('_method'));

//setup ejs
app.set('view engine','ejs'); //[MASOK]
app.use(expressLayouts); //[MASOK]
app.use(express.static('public'));

//bodyparser
app.use(express.urlencoded({extended:false}));

//express session middleware
app.use(
    session({
        secret:'secret',
        resave: true,
        saveUninitialized: true,
    })
);

//Passport middleware
app.use(passport.initialize());

app.use(passport.session());

//konfigurasi flash
app.use(flash());
// app.use(cookieParser('secret'));

//global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//[MASOK]ambil index.js dan users.js
app.use('/', require('./routes/index'));
app.use('/', require('./routes/maps'));

app.listen (port,()=>{
    console.log(`AMATI User Database | listening at http://localhost:${port}`);
});
