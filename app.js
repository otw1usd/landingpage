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

const fs = require('fs');

const FieldPhoto = require(__dirname + '/model/fieldphoto.js');
const ProjectZone = require(__dirname + '/model/projectzone.js');

io.on('connection', socket => {

//cari di database nama file fieldphoto untuk timestamp, zone, dan story tertentu
  socket.on("fieldPhotoData", async (zoneid, timestamp, story, callback) => {
    let fileNameArray = [];
    await FieldPhoto.find({
      projectzone: zoneid,
      timestamp: timestamp,
      story: story
    }, function(err, photos) {
      photos.forEach(photo => {
        fileNameArray.push(photo.fieldphoto);
      });
    });
    await ProjectZone.findOne({
      zoneid: zoneid
    }, function(err, zone) {

      const zoneRapih = zone.zonename;
      callback({
        fileNameArray: fileNameArray,
        zoneRapih: zoneRapih
      });
    });

  });

  //itung jumlah file gamtek dalam directory
  socket.on("numOfFilesData", (projectid, zoneid, story) => {
    const dir = './public/project/' + projectid + '/drawing/' + zoneid + '/' + story;
    fs.readdir(dir, (err, files) => {
      const dirlength = files.length;
      socket.emit("numOfFiles", dirlength);

    });
  });

  //itung story max dan min di satu project
  socket.on("storyMaxMin", async (projectid, callback) => {
    const storyMaxAll = [];
    const storyMinAll = [];
    await ProjectZone.find({
      projectid: projectid
    }, function(err, zones) {
      zones.forEach(zone => {
        storyMaxAll.push(zone.storyMax);
        storyMinAll.push(zone.storyMin);
      });
      let max = Math.max(...storyMaxAll);
      let min = Math.min(...storyMinAll);
      console.log("ini max " + max + " ini min " + min);
      callback({
        max: max,
        min: min
      });
    });

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
