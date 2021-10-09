//jshint esversion:8

const express = require('express');
const router = express.Router();
const {
  body,
  validationResult,
  check
} = require('express-validator');

const passport = require('passport');
const jwt = require('jsonwebtoken');

// auth
const {
  ensureAuthenticated
} = require('../config/auth');
const {
  adminEnsureAuthenticated
} = require('../config/adminauth');
const {
  projectAuth
} = require('../config/projectauth');
const {
  projectindexAuth
} = require('../config/projectindexauth');

//npm function
const multer = require('multer');
const bcrypt = require('bcryptjs');
const hash = require('object-hash');

//model
const User = require('../model/user');
const Project = require('../model/project');
const Admin = require('../model/admin');
const Comment = require('../model/comment');
const ProjectZone = require('../model/projectzone');
const FieldPhoto = require('../model/fieldphoto');
const CommentReply = require('../model/commentreply');
const TimeStampProject = require("../model/timestampproject");
const Traction = require("../model/traction");

//local function
const {
  loadMaps,
  addZoneData,
  newDataMap,
  addTimeStamp
} = require('../routes/datamaps.js');
const getDate = require('../routes/date.js');
const {
  extractZipDrone
} = require('../routes/uploadDroneImages.js');
const {
  watermarklogo,
  profilepictureresize,
  textOverlay,
  fieldphotoresize,
  logoresize,
  moveprojectlogo
} = require('./imagessettings.js');
const {
  PDFtoPNG
} = require('../routes/uploadGamtek.js');
const {
  findproject
} = require('../routes/findproject.js');
const {
  findrole
} = require('../routes/findrole.js');
const {
  senduseremailverification
} = require('../routes/userEmailVerification.js');
const {
  sendemailclient
} = require('../routes/emailsettings.js');


//

router.get('/', async (req, res) => {
  // const newTraction = new Traction({
  //   traction: '1'
  // });
  // await newTraction.save();
  res.render('index');
});

router.get('/login', (req, res) => res.render('login', {
  layout: 'layout-login',
}));

router.get('/confirmation/:token', async(req,res)=>{
  try{
    const pkpk = 'amatimaster';
    const { userid : userid} = await jwt.verify(req.params.token, pkpk);
    console.log(userid);
    await User.updateOne({_id : userid}, {confirmed:true});
    req.flash('success_msg', 'Your email has been successfully registered! ');
    res.redirect('/login');
  } catch (e) {
    res.send(e);
    req.flash('success_msg', e);
    res.redirect('/login');
  }
})

router.get('/beranda', ensureAuthenticated, async (req, res) => {
  const listprojects = await Project.find({
    username: 'contoh'
  });
  res.render('beranda', {
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
    user: req.user,
    listprojects,
    layout: 'layout-account',
  });
});

router.get('/registerproject', ensureAuthenticated, async (req, res) => {
  const listprojects = await Project.find({
    username: 'contoh'
  });
  res.render('registerproject', {
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
    user: req.user,
    layout: 'layout-account',
  });
});

router.get('/daftarproyek', ensureAuthenticated, async (req, res) => {

  const messyListProjects = await findproject(req.user.username);
  const contohprojects = await Project.find({
    username: 'contoh'
  });
  contohprojects.forEach(a=>{
    messyListProjects.push(a)});
  const listProjectIds = [];
  const listprojects = [];

  messyListProjects.forEach(messyListProject => {
    for (i = 0; i < messyListProject.length; i++) {
      if (listProjectIds.includes(String(messyListProject[i]._id)) === false) {
        listprojects.push(messyListProject[i]);
        listProjectIds.push(String(messyListProject[i]._id));
      }
    }
  });

  

 

  res.render('daftarproyek', {
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
    user: req.user,
    listprojects,
    layout: 'layout-account',
  });
});

router.get('/project/:oit', ensureAuthenticated, projectAuth, async (req, res, next) => {
  try {
    var role = await findrole(req.params.oit, req.user.username);
    const commentprojects = await Comment.find({
        projectid: req.params.oit
      })
      .populate('usernameid');
    const project = await Project.findOne({
      _id: req.params.oit
    }).catch(error => {
      throw error;
    });
    const commentreplyprojects = await CommentReply.find({
        projectid: req.params.oit
      })
      .populate('usernameid');
    res.render('project', {
      name: req.user.name,
      jobs: req.user.jobs,
      company: req.user.company,
      user: req.user,
      project,
      role,
      consultants: project.consultant,
      contractors: project.contractor,
      droneengineers: project.droneengineer,
      members: project.member,
      commentprojects,
      commentreplyprojects,
      layout: 'layout-account'
    });
  } catch (err) {
    next(err);
  }
});


router.get('/projectusername/:oit', ensureAuthenticated, projectAuth, async (req, res, next) => {
  try {
    var role = await findrole(req.params.oit, req.user.username);
    const project = await Project.findOne({
      _id: req.params.oit
    }).catch(error => {
      throw error;
    });
    res.render('projectusername', {
      name: req.user.name,
      jobs: req.user.jobs,
      company: req.user.company,
      user: req.user,
      project,
      role,
      consultants: project.consultant,
      contractors: project.contractor,
      droneengineers: project.droneengineer,
      members: project.member,
      layout: 'layout-account'
    });
  } catch (err) {
    next(err);
  }
});

//edit user profile

router.get('/edituser', ensureAuthenticated, (req, res) => {
  res.render('edituser', {
    user: req.user,
    name: req.user.name,
    layout: 'layout-account',
  });
});

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/user/uploads');
  },
  filename: (req, file, cb) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    cb(null, timeElapsed + '-' + req.body.username + '-' + file.originalname);
  }
});

const upload = multer({
  storage: Storage
});

router.put('/user', [
    body('username').custom(async (value, {
      req
    }) => {
      const duplikat = await Project.findOne({
        username: value
      });
      if (value !== req.body.oldusername && duplikat) {
        throw new Error('Username sudah digunakan');
      }
      return true;
    }),
  ],
  upload.single('image'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edituser', {
        errors: errors.array(),
        user: req.body,
        layout: 'layout-account',
      });
      console.log(errors);
    } else {
      if (req.file === undefined) {
        var filenamalama = req.body.oldimage;
      } else {
        var filenamalama = req.file.filename;
      };
      const profilepicturedest = req.file.destination + '/' + filenamalama;
      await profilepictureresize(profilepicturedest);
      await User.updateOne({
        _id: req.body._id
      }, {
        $set: {
          name: req.body.name,
          email: req.body.email,
          company: req.body.company,
          jobs: req.body.jobs,
          username: req.body.username,
          nohp: req.body.nohp,
          image: filenamalama,
        },
      }).then((result) => {
        req.flash('success_msg', 'Profil berhasil diubah!');
        res.redirect('/daftarproyek');
      });
    }
  }
);

//ADMIN
router.get('/loginadmin', (req, res) => res.render('loginadmin', {
  layout: 'layout-login',
}));
router.get('/registeradmin', (req, res) => res.render('registeradmin'));

router.get('/admin', adminEnsureAuthenticated, async (req, res) => {
  const listaccounts = await Project.find();
  res.render('admin', {
    listaccounts,
    layout: 'layout-login',
  });
});

router.get('/admin/:name', adminEnsureAuthenticated, async (req, res) => {
  const listproject = await Project.findOne({
    projectUsername: req.params.name
  });
  const listzonas = await ProjectZone.find({
    projectid: listproject._id
  });
  res.render('detail', {
    listproject,
    listzonas,
    layout: 'layout-login',
  });
});

//field photo zone
const FieldPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/project/' + req.body.projectid + '/fieldphoto/' + req.body.zoneid + '/' + req.body.story + '/' + req.body.timestamp)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + req.body.zoneid + '-' + file.originalname);
  },
});

const uploadFieldPhoto = multer({
  storage: FieldPhotoStorage
}).array('image', 100);



//tambahfieldphoto client
router.put('/tambahfieldphotoclient', uploadFieldPhoto,
  async (req, res, next) => {
    const files = req.files;
    let filesArray = [];
    const {
      zoneid,
      projectid,
      timestamp,
      story
    } = req.body;

    var listzonanows = await ProjectZone.findOne({
      zoneid: zoneid
    });
    const fieldphotozonanows = await FieldPhoto.find({
      projectzone: zoneid
    });
    await req.files.forEach(async element => {
      const file = {
        projectzone: zoneid,
        fieldphoto: element.filename
      };
      filesArray.push(file);
      const multipleFieldPhotos = new FieldPhoto({
        projectid: projectid,
        projectzone: zoneid,
        fieldphoto: element.filename,
        timestamp: timestamp,
        story: story
      });
      await multipleFieldPhotos.save();
      const fieldphotodest = element.destination + '/' + element.filename;
      fieldphotoresize(element.destination, element.filename);
      watermarklogo(fieldphotodest);
      // textOverlay(fieldphotodest);
    });
    res.redirect('/projectindex/' + req.body.projectid);
    req.flash('success_msg', 'Images Uploaded Successfully');
  });

//droneupload
const DroneImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/project/' + req.body.projectid + '/drone/' + req.body.timestamp)
  },
  filename: (req, file, cb) => {
    cb(null, req.body.timestamp + '.zip')
  }
});

const uploadDroneImage = multer({
  storage: DroneImagesStorage
}).single('droneimages');

//tambah droneimagesclient client
router.put('/tambahdroneimagesclient', uploadDroneImage, (req, res) => {
  const {
    projectid,
    timestamp
  } = req.body;
  res.redirect('/projectindex/' + req.body.projectid);
  req.flash('success_msg', 'Images Uploaded Successfully');
  extractZipDrone(req.file.destination, req.file.filename);
});

//gamtek
const GamtekStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/project/' + req.body.projectid + '/drawing/' + req.body.zoneid + '/' + req.body.story)
  },
  filename: (req, file, cb) => {
    cb(null, req.body.category + '_' + file.originalname)
  }
});

const uploadGamtekClient = multer({
  storage: GamtekStorage
}).single('gamtek');

//tambah gamtek client
router.put('/uploadgamtekclient', uploadGamtekClient, async (req, res) => {
  const {
    projectid,
    story,
    zoneid,
    category
  } = req.body;
  res.redirect('/projectindex/' + req.body.projectid);
  req.flash('success_msg', 'Gamtek Successfully');
  // await PDFtoPNG(req.file.destination, req.file.filename);
});

//register handle
router.post('/', (req, res) => {
  const {
    name,
    username,
    email,
    password,
    nohp,
    company,
    jobs
  } = req.body;
  const confirmed = false;
  let errors = [];

  //check pass length
  if (password.length < 8) {
    errors.push({
      msg: 'Password should be at least 8 characters!!!'
    });
  }

  if (errors.length > 0) {
    res.render('', {
      errors,
      name,
      username,
      email,
      password,
      nohp,
      company,
      jobs
    });
    console.log(errors);
  } else {
    //validation passed
    User.findOne({
        email: email
      })
      .then(user => {
        if (user) {
          // User exists
          errors.push({
            msg: "Email is already registered"
          });
          res.render('', {
            errors,
            name,
            username,
            email,
            password,
            nohp,
            company,
            jobs
          });
        } else {
          User.findOne({
              username: username
            })
            .then(usernameCheck => {
              if (usernameCheck) {
                // User exists
                errors.push({
                  msg: "Username is already taken. Try another."
                });
                res.render('', {
                  errors,
                  name,
                  username,
                  email,
                  password,
                  nohp,
                  company,
                  jobs
                });
              } else {
                const newUser = new User({
                  name,
                  username,
                  email,
                  password,
                  nohp,
                  company,
                  jobs,
                  confirmed
                });
                //hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  //set password to ahshed
                  newUser.password = hash;
                  //save user
                  newUser.save()
                    .then(user => {
                      senduseremailverification(newUser._id, newUser.email);
                      req.flash('success_msg', 'Please confirm your e-mail to login');
                      res.redirect('/login');
                    })
                    .catch(err => console.log(err));
                }));
              }
            });
        }
      });
  }
});

//Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local-client', {
    successRedirect: '/daftarproyek',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

//ADMIN
//register project handle
router.post('/admin', (req, res) => {
  const {
    projectName,
    location,
    projectDescription,
    startDate,
    endDate,
    projectUsername,
    projectPassword,
    username,
    progrestotal
  } = req.body;
  let errors = [];

  //validation passed
  Project.findOne({
      projectUsername: projectUsername
    })
    .then(project => {
      if (project) {
        // Project exists
        req.flash('error_msg', 'Project is Already Registered');
        res.render('admin', {
          projectName,
          location,
          projectDescription,
          startDate,
          endDate,
          projectUsername,
          projectPassword,
          username,
          progrestotal
        });
      } else {
        const newProject = new Project({
          projectName,
          location,
          projectDescription,
          startDate,
          endDate,
          projectUsername,
          projectPassword,
          username,
          progrestotal
        });

        newProject.save()
          .then(project => {
            req.flash('success_msg', 'Project are now registered');
            res.redirect('/admin');
          });

        newDataMap(projectName, newProject._id);
      }
    });
});

const PetaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/project/' + newProject._id);
  },
  filename: (req, file, cb) => {
    cb(null, 'peta.png');
  }
});

const uploadPeta = multer({
  storage: PetaStorage
}).single('petadisplay');


const ProjectLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/project/logotomoved');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.projectName+'.png');
  }
});

const uploadProjectLogo = multer({
  storage: ProjectLogoStorage
}).single('projectlogo');

router.post('/registerproject', uploadProjectLogo, (req, res, next) => {
  const {
    projectName,
    location,
    projectDescription,
    startDate,
    endDate,
    projectPassword,
    username,
    progrestotal,
    latInit,
    lngInit,
    consultant
  } = req.body;
  const projectUsername = hash(projectName);
  let errors = [];

  //validation passed
  Project.findOne({
      projectUsername: projectUsername
    })
    .then(project => {
      if (project) {
        // Project exists
        req.flash('error_msg', 'Project is Already Registered');
        res.redirect('/registerproject');
      } else {
        const newProject = new Project({
          projectName,
          location,
          projectDescription,
          startDate,
          endDate,
          projectUsername,
          projectPassword,
          username,
          progrestotal,
          consultant
        });
        newProject.save()
          .then(project => {
            moveprojectlogo(req.file.destination, req.file.filename, newProject._id);
            req.flash('success_msg', 'Project are now registered');
            res.redirect('/daftarproyek');
          });

        newDataMap(projectName, newProject._id, latInit, lngInit);
      }
    });
});

router.delete('/deleteproject', async (req, res) => {

  await CommentReply.deleteMany({
    projectid: req.body.projectid
  });

  await Comment.deleteMany({
    projectid: req.body.projectid
  });

  await ProjectZone.deleteMany({
    projectid: req.body.projectid
  });
  await FieldPhoto.deleteMany({
    projectid: req.body.projectid
  });

  await TimeStampProject.deleteMany({
    projectid: req.body.projectid
  });

  await Project.deleteOne({
      _id: req.body.projectid
    })
    .then((result) => {
      req.flash('success_msg', 'Project has been deleted!');
      res.redirect('/daftarproyek');
    });
});

//tambah zona
router.post('/tambahzona', async (req, res, next) => {
  try {
    const {
      projectUsername,
      projectid,
      detailzona,
      zoneLat,
      zoneLng,
      storyMax,
      storyMin
    } = req.body;
    const zoneid = hash(detailzona);
    await Project.findOne({
        _id: projectid
      })
      .then(project => {
        const newZone = new ProjectZone({
          projectid: projectid,
          zonename: detailzona,
          zoneid: zoneid,
          storyMax: storyMax,
          storyMin: storyMin
        });
        const newContentZoneData = {
          projectid,
          detailzona,
          zoneid,
          zoneLat,
          zoneLng,
          storyMax,
          storyMin
        };
        addZoneData(projectid, newContentZoneData);
        newZone.save();
        res.redirect('/projectindex/' + projectid);
        req.flash('success_msg', 'Berhasil tambah zona ');
      })
      .catch(error => {
        throw error
      });
  } catch (err) {
    next(err);
  }
});

//tambah waktu
router.post('/tambahtimestamp', async (req, res, next) => {
  try {
    const {
      projectUsername,
      projectid,
      detailtimestamp
    } = req.body;
    await Project.findOne({
        _id: projectid
      })
      .then(project => {
        const newTimeStamp = new TimeStampProject({
          projectid,
          timestampproject: detailtimestamp,
        });
        addTimeStamp(projectid, newTimeStamp);
        newTimeStamp.save()
          .then(project => {
            req.flash('success_msg', 'Berhasil tambah waktu ');
            res.redirect('/projectindex/' + projectid);
          });
      })
      .catch(error => {
        throw error
      });
  } catch (err) {
    next(err);
  }
});

router.post('/editdatazona', async (req, res, next) => {
  try {
    const {
      listzonaid
    } = req.body;
    const listzonanows = await ProjectZone.find({
      _id: listzonaid
    });
    const fieldphotozonanows = await FieldPhoto.find({
      projectzone: listzonaid
    });
    res.render('editdatazona', {
      listzonanows,
      zonaid: listzonaid,
      fieldphotozonanows,
      layout: 'layout-login',
    })
  } catch (err) {
    next(err);
  };
});

//register handle
router.post('/registeradmin', (req, res) => {
  const {
    username,
    password
  } = req.body;
  let errors = [];

  //check pass length
  if (password.length < 8) {
    errors.push({
      msg: 'Password should be at least 8 characters!!!'
    });
  }

  if (errors.length > 0) {
    res.render('', {
      errors,
      username,
      password
    });
    console.log(errors);
  } else {
    //validation passed
    Admin.findOne({
        username: username
      })
      .then(user => {
        if (user) {
          // User exists
          errors.push({
            msg: "username is already registered"
          });
          res.render('', {
            errors,
            username,
            password
          });
        } else {
          const newAdmin = new Admin({
            username,
            password

          });
          //hash password
          bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to ahshed
            newAdmin.password = hash;
            //save user
            newAdmin.save()
              .then(admin => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/loginadmin');
              })
              .catch(err => console.log(err));
          }));
        }
      });
  }
});

//Admin Login handle
router.post('/loginadmin', (req, res, next) => {
  passport.authenticate('local-admin', {
    successRedirect: '/admin',
    failureRedirect: '/loginadmin',
    failureFlash: true,
  })(req, res, next);
});

//Admin logout handle
router.get('/logoutadmin', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/loginadmin');
});

//delete project
router.delete('/admin', async (req, res) => {
  await Project.deleteOne({
      projectUsername: req.body.projectUsername
    })
    .then((result) => {
      req.flash('success_msg', 'Project berhasil dihapus!');
      res.redirect('/admin');
    });
});

//edit project
router.get('/admin/edit/:projectUsername', adminEnsureAuthenticated, async (req, res) => {
  const projectnow = await Project.findOne({
    projectUsername: req.params.projectUsername
  });
  // const ProjectDataMaps = await loadMaps(projectnow._id);
  res.render('admineditproject', {
    projectnow,
    layout: 'layout-login',
    // ProjectDataMaps,
  });
});

router.put('/admin', [
    body('projectUsername').custom(async (value, {
      req
    }) => {
      const duplikat = await Project.findOne({
        projectUsername: value
      });
      if (value !== req.body.oldprojectUsername && duplikat) {
        throw new Error('Nama kontak sudah digunakan');
      }
      return true;
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('admineditproject', {
        errors: errors.array(),
        project: req.body,
      });
    } else {
      Project.updateOne({
        _id: req.body._id
      }, {
        $set: {
          projectName: req.body.projectName,
          location: req.body.location,
          projectDescription: req.body.projectDescription,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          username: req.body.username,
          projectUsername: req.body.projectUsername,
          projectPassword: req.body.projectPassword,
          progrestotal: req.body.progrestotal,
          timestampproject1: req.body.timestampproject1,
          nilaiProyek: req.body.nilaiProyek,
          konsultan: req.body.konsultan,
          kontraktor: req.body.kontraktor
        },
      }, function() {});

      // .then((result) => {
      //   return delayfunction(5000).then(function() {
      //     console.log('Resolved!');
      // });

      // console.log('inibulanan: '+ monthDiff(req.body.startDate, req.body.endDate));
      // if req.body.timestampproject1 === "Mingguan", enddate kurang startdate, trus bagi 7 berapa minggu trus + 1, trus input timestampproject2 jumlah minggu

      // else if req.body.timestampproject === "Bulanan", enddate kurang stardate berapa bulan, trus +1 trus tambahin sampe bulan dari bulan itu

      setTimeout(() => {
        req.flash('success_msg', 'Data Project berhasil diubah!');
        res.redirect('/admin');
      }, 1000);

      // });
    }
  });


//project
router.get('/projectindex/:projectid', ensureAuthenticated, projectindexAuth, async (req, res, next) => {
  var role = await findrole(req.params.projectid, req.user.username);
  var FieldPhotoArrays = [];
  var monthYearTimeStampProject = [];
  var numericValueTimeStampProject = [];
  const ProjectDataMaps = await loadMaps(req.params.projectid);
  const ProjectDataMapsProjectZone = ProjectDataMaps.projectzone;
  try {
    var project = await Project.findOne({
        _id: req.params.projectid
      })
      .catch(error => {
        throw error
      });
    var projectZones = await ProjectZone.find({
      projectid: project._id
    });
    projectZones.forEach(async element => {
      const fieldphotoarray = await FieldPhoto.find({
        projectzone: element.zoneid
      });
      FieldPhotoArrays.push(fieldphotoarray);
    });
    var timeStampProject = await TimeStampProject.find({
      projectid: req.params.projectid
    });
    timeStampProject.forEach(time => {
      let utcOffset = time.timestampproject.getTimezoneOffset();
      time.timestampproject.setMinutes(
        time.timestampproject.getMinutes() + utcOffset
      );
      let monthyeartimestamp = getDate.getMonthYear(time.timestampproject);
      monthYearTimeStampProject.push(monthyeartimestamp);

      let numericvaluetimestampproject = getDate.getNumericValue(time.timestampproject).split("/").join("_");
      numericValueTimeStampProject.push(numericvaluetimestampproject);
    });

  } catch (err) {
    next(err);
  }
  setTimeout(function() {
    res.render('projectindex', {
      layout: 'layout-project',
      name: req.user.name,
      jobs: req.user.jobs,
      company: req.user.company,
      project,
      role,
      projectZones,
      FieldPhotoArrays,
      users: req.user,
      monthYearTimeStampProject,
      numericValueTimeStampProject,
      timeStampProject,
      ProjectDataMapsProjectZone
    });

  }, 1000);

});

// submit comment handle
router.post('/projectcomment', async (req, res, next) => {
  const {
    usernameid,
    isicomment,
    projectid,
    role,
    company,
    picture
  } = req.body;
  const newComment = new Comment({
    usernameid: usernameid,
    isicomment: isicomment,
    projectid: projectid,
    role: role,
    company: company,
    picture: picture,
  });
  newComment.save()
    .then(project => {
      req.flash('success_msg', 'Your comment has been posted');
      res.redirect('/project/' + projectid);
    });
});

router.post('/projectcommentreply', async (req, res, next) => {
  const {
    usernameid,
    projectid,
    role,
    company,
    picture,
    commentprojectid,
    komentarbalasan
  } = req.body;
  const newCommentReply = new CommentReply({
    usernameid: usernameid,
    projectid: projectid,
    role: role,
    company: company,
    picture: picture,
    commentprojectid: commentprojectid,
    komentarbalasan: komentarbalasan
  });
  newCommentReply.save()
    .then(project => {
      req.flash('success_msg', 'Your reply has been posted');
      res.redirect('/project/' + projectid);
    });
});

//show comment
router.delete('/comment', async (req, res) => {
  const {
    commentprojectid,
    projectid
  } = req.body;
  await CommentReply.deleteMany({
    commentprojectid: commentprojectid,
  });

  await Comment.deleteOne({
      _id: commentprojectid
    })
    .then((result) => {
      req.flash('success_msg', 'Comment berhasil dihapus!');
      res.redirect('/project/' + projectid);
    });
});


//username settings
//consultant
router.put('/addconsultant', async (req, res) => {
  const {
    projectid,
    consultant
  } = req.body;

  const checkUsernameExist = await User.findOne({
    username: consultant
  });
  if (checkUsernameExist) {

    const project = await Project.findOne({
        _id: projectid
      })
      .then(project => {
        return project;
      });
    var newListConsultants = project.consultant;
    if (newListConsultants.includes(consultant) === false) {
      newListConsultants.push(consultant);
      Project.updateOne({
        _id: projectid
      }, {
        $set: {
          consultant: newListConsultants
        },
      }, function() {});
    }
    setTimeout(() => {
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  } else {
    setTimeout(() => {
      req.flash('error_msg', 'Username belum terdaftar!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  }

});

router.delete('/consultant', async (req, res) => {
  const {
    consultant,
    projectid
  } = req.body;
  const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project;
    });
  var oldListConsultants = project.consultant;
  var newListConsultants = [];

  oldListConsultants.forEach((oldConsultant) => {
    if (oldConsultant === consultant) {

    } else {
      newListConsultants.push(oldConsultant);
    }
  });

  Project.updateOne({
    _id: projectid
  }, {
    $set: {
      consultant: newListConsultants
    },
  }, function() {});
  setTimeout(() => {
    // req.flash('success_msg', 'Data Project berhasil diubah!');
    res.redirect('/projectusername/' + projectid);
  }, 1000);
});

//contractor
router.put('/addcontractor', async (req, res) => {
  const {
    projectid,
    contractor
  } = req.body;

  const checkUsernameExist = await User.findOne({
    username: contractor
  });
  if (checkUsernameExist) {

    const project = await Project.findOne({
        _id: projectid
      })
      .then(project => {
        return project;
      });
    // const roleExist = await findrole(projectid, contractor);
    // if (roleExist.length === 0) {

    var newListContractors = project.contractor;
    if (newListContractors.includes(contractor) === false) {
      newListContractors.push(contractor);
      Project.updateOne({
        _id: projectid
      }, {
        $set: {
          contractor: newListContractors
        },
      }, function() {});
    }
    setTimeout(() => {
      // req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  } else {
    setTimeout(() => {
      req.flash('error_msg', 'Username belum terdaftar!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  }
  // } else {
  //   req.flash('error_msg', 'Username has been assigned!');
  //   res.redirect('/project/' + projectid);
  // }
});

router.delete('/contractor', async (req, res) => {
  const {
    contractor,
    projectid
  } = req.body;
  const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project;
    });
  var oldListContractors = project.contractor;
  var newListContractors = [];

  oldListContractors.forEach((oldContractor) => {
    if (oldContractor === contractor) {

    } else {
      newListContractors.push(oldContractor);
    }
  });

  Project.updateOne({
    _id: projectid
  }, {
    $set: {
      contractor: newListContractors
    },
  }, function() {});
  setTimeout(() => {
    // req.flash('success_msg', 'Data Project berhasil diubah!');
    res.redirect('/projectusername/' + projectid);
  }, 1000);
});

//droneengineer
router.put('/adddroneengineer', async (req, res) => {
  const {
    projectid,
    droneengineer
  } = req.body;
  const checkUsernameExist = await User.findOne({
    username: droneengineer
  });
  if (checkUsernameExist) {

    const project = await Project.findOne({
        _id: projectid
      })
      .then(project => {
        return project;
      });
    // const roleExist = await findrole(projectid, droneengineer);
    // if (roleExist.length === 0) {

    var newListDroneengineers = project.droneengineer;
    if (newListDroneengineers.includes(droneengineer) === false) {
      newListDroneengineers.push(droneengineer);
      Project.updateOne({
        _id: projectid
      }, {
        $set: {
          droneengineer: newListDroneengineers
        },
      }, function() {});
    }
    setTimeout(() => {
      // req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  } else {
    setTimeout(() => {
      req.flash('error_msg', 'Username belum terdaftar!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  }
  // } else {
  //   req.flash('error_msg', 'Username has been assigned!');
  //   res.redirect('/project/' + projectid);
  // }
});

router.delete('/droneengineer', async (req, res) => {
  const {
    droneengineer,
    projectid
  } = req.body;
  const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project;
    });
  var oldListDroneengineers = project.droneengineer;
  var newListDroneengineers = [];

  oldListDroneengineers.forEach((oldDroneengineer) => {
    if (oldDroneengineer === droneengineer) {

    } else {
      newListDroneengineers.push(oldDroneengineer);
    }
  });

  Project.updateOne({
    _id: projectid
  }, {
    $set: {
      droneengineer: newListDroneengineers
    },
  }, function() {});
  setTimeout(() => {
    // req.flash('success_msg', 'Data Project berhasil diubah!');
    res.redirect('/projectusername/' + projectid);
  }, 1000);
});

//member
router.put('/addmember', async (req, res) => {
  const {
    projectid,
    member
  } = req.body;

  const checkUsernameExist = await User.findOne({
    username: member,
  });
  if (checkUsernameExist) {

    const project = await Project.findOne({
        _id: projectid
      })
      .then(project => {
        return project;
      });
    // const roleExist = await findrole(projectid, member);
    // if (roleExist.length === 0) {

    var newListMembers = project.member;
    if (newListMembers.includes(member) === false) {
      newListMembers.push(member);
      Project.updateOne({
        _id: projectid
      }, {
        $set: {
          member: newListMembers
        },
      }, function() {});
    }
    setTimeout(() => {
      // req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  } else {
    setTimeout(() => {
      req.flash('error_msg', 'Username belum terdaftar!');
      res.redirect('/projectusername/' + projectid);
    }, 1000);
  }
  // } else {
  //   req.flash('error_msg', 'Username has been assigned!');
  //   res.redirect('/project/' + projectid);
  // }
});

router.delete('/member', async (req, res) => {
  const {
    member,
    projectid
  } = req.body;
  const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project;
    });
  var oldListMembers = project.member;
  var newListMembers = [];

  oldListMembers.forEach((oldMember) => {
    if (oldMember === member) {} else {
      newListMembers.push(oldMember);
    }
  });

  Project.updateOne({
    _id: projectid
  }, {
    $set: {
      member: newListMembers
    },
  }, function() {});
  setTimeout(() => {
    // req.flash('success_msg', 'Data Project berhasil diubah!');
    res.redirect('/projectusername/' + projectid);
  }, 1000);
});

// const LogoStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/project/'+req.body.projectid)
//   },
//   filename: (req, file, cb) => {
//     cb(null, 'logo.png');
//   }
// });

// const uploadLogo = multer({
//   storage: LogoStorage
// }).single('logo');

// router.put('/uploadlogo', uploadLogo,
//   async (req, res, next) => {
//     const dest = req.file.destination;
//     console.log(dest);
//     console.log(req.file);
//     const filename = req.file.filename;
//     const {
//       projectid
//     } = req.body;
//       logoresize(dest, filename);
//       // console.log(req.file.filename);
//       console.log(req.body.projectid);
//     res.redirect('/project/' + req.body.projectid);
//     req.flash('success_msg', 'Logo Uploaded Successfully');
//   });

router.post('/sendemail', async (req, res, next) => {
  const {
    name,
    email,
    subject,
    message
  } = req.body;
  await sendemailclient(name, email, subject, message);
  req.flash('email_msg', 'Your email has been sent successfully');
  res.redirect('/#contactUs');  
});


module.exports = router;
