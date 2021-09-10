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

const multer = require('multer');
// const sharp = require ('sharp');

const User = require('../model/user');
const Project = require('../model/project');
const Admin = require('../model/admin');
const Comment = require('../model/comment');
const ProjectZone = require('../model/projectzone');
const FieldPhoto = require('../model/fieldphoto');
const CommentReply = require('../model/commentreply');
const TimeStampProject = require("../model/timestampproject");
const bcrypt = require('bcryptjs');

const getDate = require('../routes/date.js');

router.get('/', (req, res) => res.render('index'));
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
      commentprojects,
      commentreplyprojects,
      layout: 'layout-account',
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

      // await sharp(req.file.destination+'/'+filenamalama).toBuffer().then(
      //   (data)=>{ sharp(data).rotate(90).resize(300).toFile(req.file.destination+'/'+filenamalama, (err,info)=>{
      //     console.log('image resized');
      //   })
      //     })
      //     .catch((err)=>{console.log(err);})

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
    cb(null, './public/project/dataset/fieldphoto')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + req.body.zonaid + '-' + file.originalname);
  },
});

const uploadFieldPhoto = multer({
  storage: FieldPhotoStorage
}).array('image', 100);

//post photo zone
router.put('/tambahfieldphoto', uploadFieldPhoto,
  async (req, res, next) => {
    const files = req.files;
    let filesArray = [];
    const {
      zonaid
    } = req.body;
    const listzonanows = await ProjectZone.find({
      _id: zonaid
    });
    const fieldphotozonanows = await FieldPhoto.find({
      projectzone: zonaid
    });

    await req.files.forEach(element => {

      // sharp(element.destination+'/'+element.filename).toBuffer().then(
      //   (data)=>{ sharp(data).rotate(90).resize(600).toFile(element.destination+'/'+element.filename, (err,info)=>{
      //     console.log('image resized '+ element.destination+'/'+element.filename);
      //   })
      //     })
      //     .catch((err)=>{console.log(err);});

      const file = {
        projectzone: zonaid,
        fieldphoto: element.filename,
      };
      filesArray.push(file);
      const multipleFieldPhotos = new FieldPhoto({
        projectzone: zonaid,
        fieldphoto: element.filename,
      });
      multipleFieldPhotos.save();
    });
    res.render('editdatazona', {
      listzonanows,
      zonaid,
      fieldphotozonanows,
      layout: 'layout-login',
    })
    req.flash('success_msg', 'Images Uploaded Successfully');
  })

//tambahfieldphoto client
router.put('/tambahfieldphotoclient', uploadFieldPhoto,
  async (req, res, next) => {
    const files = req.files;
    let filesArray = [];
    const {
      zonaid
    } = req.body;
    var listzonanows = await ProjectZone.findOne({
      _id: zonaid
    });
    const fieldphotozonanows = await FieldPhoto.find({
      projectzone: zonaid
    });
    await req.files.forEach(element => {

      // sharp(element.destination+'/'+element.filename).toBuffer().then(
      //   (data)=>{ sharp(data).rotate(90).resize(600).toFile(element.destination+'/'+element.filename, (err,info)=>{
      //     console.log('image resized '+ element.destination+'/'+element.filename);
      //   })
      //     })
      //     .catch((err)=>{console.log(err);});

      const file = {
        projectzone: zonaid,
        fieldphoto: element.filename,
      };
      filesArray.push(file);
      const multipleFieldPhotos = new FieldPhoto({
        projectzone: zonaid,
        fieldphoto: element.filename,
      });
      multipleFieldPhotos.save();
    });
    res.redirect('/projectindex/' + listzonanows.projectid);
    req.flash('success_msg', 'Images Uploaded Successfully');
  });



//
//     console.log(req.files);
//     console.log('ini zonaid input:' +zonaid);
// }
// );

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
            msg: "email is already registered"
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
      }
    });
});

//tambah zona
router.post('/tambahzona', async (req, res, next) => {
  try {
    const {
      projectUsername,
      projectid,
      detailzona
    } = req.body;
    await Project.findOne({
        _id: projectid
      })
      .then(project => {
        const newZone = new ProjectZone({
          projectid,
          zonename: detailzona,
        });
        newZone.save()
          .then(project => {
            req.flash('success_msg', 'Berhasil tambah zona ');
            res.redirect('/admin/' + projectUsername);
          });
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
        newTimeStamp.save()
          .then(project => {
            req.flash('success_msg', 'Berhasil tambah waktu ');
            res.redirect('/admin/' + projectUsername);
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
  res.render('admineditproject', {
    projectnow,
    layout: 'layout-login',
  });
  console.log('inicobacekzzz' + projectnow);
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
      console.log(req.body);
      console.log(req.body._id);
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
          nilaiProyek : req.body.nilaiProyek,
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
        console.log('ini timestamp 1 ' + req.body.timestampproject1);
        console.log('ini timestamp 2 ' + req.body.timestampproject2);
      }, 1000);

      // });
    }
  });


//project

router.get('/projectindex/:projectid', ensureAuthenticated, async (req, res, next) => {
  var FieldPhotoArrays = [];
  var monthYearTimeStampProject = [];
  var numericValueTimeStampProject = [];
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

    await projectZones.forEach(async element => {
      const fieldphotoarray = await FieldPhoto.find({
        projectzone: element._id
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
      monthYearTimeStampProject,
      numericValueTimeStampProject,
      timeStampProject
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


module.exports = router;
