// const fs = require('fs');
//jshint esversion: 8
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const methodOverride = require('method-override');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const session = require('express-session');
// const cookieParser = require ('cookie-parser');
const flash = require('connect-flash');

// passport config
require('./config/passport')(passport);

//DB CONFIG and conenct mongo
require('./config/db');

const app = express();
const port = 3000 || process.env.PORT;

const server = http.createServer(app);
const io = socketio(server);

const FieldPhoto = require(__dirname + '/model/fieldphoto.js');

io.on('connection', socket => {

  socket.on("fieldPhotoData", async (zoneid, timestamp) => {
    let fileNameArray = [];
    const fileName = await FieldPhoto.find({
      projectzone: zoneid,
      timestamp: timestamp
    }, function(err, photos) {
      photos.forEach(photo => {
        fileNameArray.push(photo.fieldphoto);
      });
    });
    socket.emit("fileNameArray", fileNameArray, zoneid, timestamp);
  });
});

//setup method override
app.use(methodOverride('_method'));

//setup ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

//bodyparser
app.use(express.urlencoded({
  extended: false
}));

//express session middleware
app.use(
  session({
    secret: 'secret',
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
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// ambil index.js dan users.js
app.use('/', require('./routes/index'));

server.listen(port, () => {
  console.log(`AMATI | listening at http://localhost:${port}`);
});
