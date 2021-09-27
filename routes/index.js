//jshint esversion:8

const express = require('express');
const router = express.Router();
const {
  body,
  validationResult,
  check
} = require('express-validator');

const passport = require('passport');

const {
  ensureAuthenticated
} = require('../config/auth')
const {
  adminEnsureAuthenticated
} = require('../config/adminauth')

//npm function
const multer = require('multer');
// const sharp = require ('sharp');
const bcrypt = require('bcryptjs');

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
const { watermarklogo, profilepictureresize, textOverlay, fieldphotoresize } = require('./imagessettings.js');

//

router.get('/', async (req, res) => {
  const newTraction = new Traction({
    traction: '1'
  });
  await newTraction.save();
  res.render('index');
});

router.get('/login', (req, res) => res.render('login', {
  layout: 'layout-login',
}));
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
    listprojects,
    layout: 'layout-account',
  });
});

router.get('/daftarproyek', ensureAuthenticated, async (req, res) => {
  const listprojects = await Project.find({
    username: req.user.username
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

router.get('/project/:oit', ensureAuthenticated, async (req, res, next) => {
  try {
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
    cb(null, './public/user/uploads')
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
      const profilepicturedest = req.file.destination+'/'+filenamalama;
      await profilepictureresize(profilepicturedest);
      await textOverlay(profilepicturedest);
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
        res.redirect('/beranda');
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
    cb(null, './public/project/' + req.body.projectid + '/fieldphoto/' + req.body.zoneid + '/' + req.body.timestamp)
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
      timestamp
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
        projectzone: zoneid,
        fieldphoto: element.filename,
        timestamp
      });
      await multipleFieldPhotos.save();
      const fieldphotodest = element.destination+'/'+element.filename;
      console.log(fieldphotodest);
      fieldphotoresize(element.destination, element.filename);
      watermarklogo(fieldphotodest);
      textOverlay(fieldphotodest);
    });
    res.redirect('/projectindex/' + req.body.projectid);
    req.flash('success_msg', 'Images Uploaded Successfully');
  });

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
  console.log('cekfile: ' + req.file);
  const {
    projectid,
    timestamp
  } = req.body;
  console.log(req.body);
  res.redirect('/projectindex/' + req.body.projectid);
  req.flash('success_msg', 'Images Uploaded Successfully');
  extractZipDrone(req.file.destination, req.file.filename);
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
                  jobs

                });
                //hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  //set password to ahshed
                  newUser.password = hash;
                  //save user
                  newUser.save()
                    .then(user => {
                      req.flash('success_msg', 'You are now registered and can log in');
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
    successRedirect: '/beranda',
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
    cb(null, './public/project/' + newProject._id)
  },
  filename: (req, file, cb) => {
    cb(null, peta.png);
  }
});

const uploadPeta = multer({
  storage: Storage
}).single('image');

router.post('/registerproject', uploadPeta, (req, res) => {
  const {
    projectName,
    location,
    projectDescription,
    startDate,
    endDate,
    projectUsername,
    projectPassword,
    username,
    progrestotal,
    latInit,
    lngInit,
    consultant
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
        res.render('registerproject', {
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
            req.flash('success_msg', 'Project are now registered');
            res.redirect('/daftarproyek');
          });

        newDataMap(projectName, newProject._id, latInit, lngInit);
      }
    });
});

//tambah zona
router.post('/tambahzona', async (req, res, next) => {
  try {
    const {
      projectUsername,
      projectid,
      detailzona,
      zoneid,
      zoneLat,
      zoneLng,
    } = req.body;
    await Project.findOne({
        _id: projectid
      })
      .then(project => {
        const newZone = new ProjectZone({
          projectid,
          zonename: detailzona,
          zoneid
        });
        const newContentZoneData = {
          projectid,
          detailzona,
          zoneid,
          zoneLat,
          zoneLng
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

//DISINI AMBIL DATA DARI MAPS.JSON TIMESTAMPNYA? ATAU GAUSAH TPI OVERLAP DI JSON DAN MONGODB

router.get('/projectindex/:projectid', ensureAuthenticated, async (req, res, next) => {
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
    jobs,
    company,
    picture
  } = req.body;
  const newComment = new Comment({
    usernameid: usernameid,
    isicomment: isicomment,
    projectid: projectid,
    jobs: jobs,
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
    jobs,
    company,
    picture,
    commentprojectid,
    komentarbalasan
  } = req.body;
  const newCommentReply = new CommentReply({
    usernameid: usernameid,
    projectid: projectid,
    jobs: jobs,
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
  await Comment.deleteOne({
      _id: commentprojectid
    })
    .then((result) => {
      req.flash('success_msg', 'Comment berhasil dihapus!');
      res.redirect('/project/' + projectid);
    });
});

//buka FieldPhoto
// router.post("/bukafieldphoto", function (req,res) {
//   const projectZoneId = req.body.zoneid;
//   const timeStamp = req.body.timestamp;
// });


//username settings
//consultant
router.put('/addconsultant', async (req, res) => {
  const {
      projectid,
      consultant
    } = req.body;
    
    const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project
    });
    var newListConsultants=project.consultant;
    newListConsultants.push(consultant);
    Project.updateOne({
      _id: projectid
    }, {
      $set: {
        consultant: newListConsultants
      },
    }, function() {});
    setTimeout(() => {
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
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
      return project
    });
    var oldListConsultants = project.consultant;
    var newListConsultants=[];

    oldListConsultants.forEach((oldConsultant)=> {
      if (oldConsultant === consultant) {
        
      } else {
        newListConsultants.push(oldConsultant)
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
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
  });

  //contractor
router.put('/addcontractor', async (req, res) => {
  const {
      projectid,
      contractor
    } = req.body;
    
    const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project
    });
    var newListContractors=project.contractor;
    newListContractors.push(contractor);
    Project.updateOne({
      _id: projectid
    }, {
      $set: {
        contractor: newListContractors
      },
    }, function() {});
    setTimeout(() => {
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
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
      return project
    });
    var oldListContractors = project.contractor;
    var newListContractors=[];

    oldListContractors.forEach((oldContractor)=> {
      if (oldContractor === contractor) {
        
      } else {
        newListContractors.push(oldContractor)
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
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
  });

  //droneengineer
router.put('/adddroneengineer', async (req, res) => {
  const {
      projectid,
      droneengineer
    } = req.body;
    
    const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project
    });
    var newListDroneengineers=project.droneengineer;
    newListDroneengineers.push(droneengineer);
    Project.updateOne({
      _id: projectid
    }, {
      $set: {
        droneengineer: newListDroneengineers
      },
    }, function() {});
    setTimeout(() => {
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
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
      return project
    });
    var oldListDroneengineers = project.droneengineer;
    var newListDroneengineers=[];

    oldListDroneengineers.forEach((oldDroneengineer)=> {
      if (oldDroneengineer === droneengineer) {
        
      } else {
        newListDroneengineers.push(oldDroneengineer)
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
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
  });

  //member
router.put('/addmember', async (req, res) => {
  const {
      projectid,
      member
    } = req.body;
    
    const project = await Project.findOne({
      _id: projectid
    })
    .then(project => {
      return project
    });
    var newListMembers=project.member;
    newListMembers.push(member);
    Project.updateOne({
      _id: projectid
    }, {
      $set: {
        member: newListMembers
      },
    }, function() {});
    setTimeout(() => {
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
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
      return project
    });
    var oldListMembers = project.member;
    var newListMembers=[];

    oldListMembers.forEach((oldMember)=> {
      if (oldMember === member) {
        
      } else {
        newListMembers.push(oldMember)
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
      req.flash('success_msg', 'Data Project berhasil diubah!');
      res.redirect('/project/'+projectid);
    }, 1000);
  });


module.exports = router;
