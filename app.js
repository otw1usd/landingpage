// const fs = require('fs');
//jshint esversion: 6
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
  console.log("New WS Connection...");


  socket.on("fieldPhotoData", async (zoneid, timestamp) => {
    console.log(zoneid);
    console.log(timestamp);

    const fileNameArray = [];
    const fileName = await FieldPhoto.find({
      projectzone: zoneid
    }, function(err, photos) {
      console.log(photos);
      photos.forEach(photo => {
        fileNameArray.push(photo.fieldphoto);
        console.log(photo.fieldphoto + "askcjnakscaksjcna");
      });

    });
    console.log(fileNameArray);
    socket.emit("fileNameArray", fileNameArray);

  });

  // socket.emit("fileNameaa", "test");

  // app.post("/bukafieldphoto", function(req, res) {

  //
  // const projectZoneId = req.body.zoneid;
  // const timeStamp = req.body.timestamp;
  //
  // const fileName = FieldPhoto.find({
  //   projectzone: projectZoneId
  // }, function(err, photos) {
  //
  //
  //
  //   socket.emit("projectZoneId", projectZoneId);
  //   socket.emit("timeStamp", timeStamp);
  //   socket.emit("fileName", photos);
  //   console.log("acskjanckanaksjascnakjcnkajsckanjckjcankasncajcn");
  //   console.log(photos);

  // res.send("gimane cara bikin dia ga pindah kesini tapi tetep di page sebelomnya? kalo res.send ga ditulis, dia bakal loading trus lama lama tetep bakal pindah page sendiri")

  // });

  //
  //   socket.emit("projectZoneId", projectZoneId);
  //   socket.emit("timeStamp", timeStamp);
  //
  // });

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
  console.log(`AMATI User Database | listening at http://localhost:${port}`);
});
