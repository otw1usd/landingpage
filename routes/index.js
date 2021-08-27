//jshint esversion:8

const express = require ('express');
const router = express.Router();
const { body, validationResult, check } = require ('express-validator');

const passport = require('passport');

const { ensureAuthenticated } = require('../config/auth')
const { adminEnsureAuthenticated } = require('../config/adminauth')

const multer = require('multer');

const User = require('../model/user');
const Project = require('../model/project');
const Admin = require('../model/admin');
const Comment = require('../model/comment');
const bcrypt = require ('bcryptjs');



router.get('/', (req,res) => res.render ('index'));
router.get('/login',(req,res)=>res.render('login',{
    layout: 'layout-login',
}));
router.get('/beranda', ensureAuthenticated,async(req,res)=>{
    console.log(req.user);
    const listprojects = await Project.find({username: 'contoh'});
    res.render('beranda',{
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
    user : req.user,
    listprojects,
    layout: 'layout-account',
    });
});

router.get('/daftarproyek', ensureAuthenticated, async(req,res)=> {
    console.log(req.user.username);
    const listprojects = await Project.find({username: req.user.username});
    res.render('daftarproyek',{
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
    user : req.user,
    listprojects,
    layout: 'layout-account',
        });
});

router.get('/project/:oit', ensureAuthenticated, async(req,res,next)=>{
    try{
     console.log('cek:'+req.params.oit);

     const commentprojects = await Comment.find({projectid: req.params.oit});
     const project = await Project.findOne({_id: req.params.oit}).catch(error => { throw error});     

     console.log(project);
     res.render('project',{
        name: req.user.name,
        jobs: req.user.jobs,
        company: req.user.company,
        user: req.user,
        project,
        commentprojects,
        layout: 'layout-account',
    });
        } catch (err) {
            next(err);
                }
});

//edit user profile

router.get('/edituser',ensureAuthenticated, (req,res)=>{
    res.render('edituser',{
        user: req.user,
        name : req.user.name,
        layout:'layout-account',
    });
});

const Storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, './public/user/uploads')
      },
    filename: (req,file,cb)=>{
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage : Storage 
}).single('image');

router.put('/user',[
    body('username').custom(async(value,{ req })=>{
        const duplikat = await Project.findOne({username: value});
        if(value!== req.body.oldusername && duplikat){
            throw new Error ('Username sudah digunakan');
        }
        
        return true;
    }),
],
upload,
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('edituser',{
            errors:errors.array(),
            user:req.body,
            layout:'layout-account',
        });
    
    console.log(errors);
    } else{
        console.log(req.file),
         await User.updateOne({ _id: req.body._id },
            {
                $set : {
                    username : req.body.username,
                    email : req.body.email,
                    company : req.body.company,
                    jobs : req.body.jobs,
                    username: req.body.username,
                    nohp : req.body.nohp,
                    image: req.file.filename,
                },
            }
        ).then((result)=>{
        req.flash('success_msg','Profil berhasil diubah!');
        res.redirect('/beranda');
        });
    }
});

//ADMIN
router.get('/loginadmin',(req,res)=>res.render('loginadmin',{
    layout: 'layout-login',
}));
router.get('/registeradmin', (req,res) => res.render ('registeradmin'));

router.get('/admin', adminEnsureAuthenticated, async (req,res) => {
    const listaccounts = await Project.find();
    console.log('tesuseradmin:'+req.user);
    res.render ('admin',{
        listaccounts,
        layout: 'layout-login',
    });
});

router.get('/admin/:projectUsername',adminEnsureAuthenticated, async (req,res) => {

    const listproject = await Project.findOne({projectUsername: req.params.projectUsername});
    console.log(listproject);
    res.render ('detail',{
        listproject,
    });
});

//register handle
router.post('/', (req,res)=>{
    const { name, username, email, password, nohp, company, jobs } = req.body;
    let errors = [];

    //check pass length
    if(password.length<8){
        errors.push({msg:'Password should be at least 8 characters!!!'});
    }

    if (errors.length>0){
        res.render('',{
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
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // User exists
                errors.push({msg: "email is already registered"});
                res.render('',{
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
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newUser.password, salt,(err, hash)=>{
                    if(err) throw err;
                    //set password to ahshed
                    newUser.password = hash;
                    //save user
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You are now registered and can log in');
                        res.redirect('/login');
                    })
                    .catch(err=>console.log(err));
                }));
            }
        });
    }
});

//Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local-client',{
     successRedirect: '/beranda',
     failureRedirect: '/login',
     failureFlash: true,
    }) (req, res, next);
});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

//ADMIN
//register project handle
router.post('/admin', (req,res)=>{
    const { projectName, location, projectDescription, startDate, endDate, projectUsername, projectPassword, username } = req.body;
    let errors = [];

        //validation passed
        Project.findOne({ projectUsername: projectUsername })
        .then(project => {
            if(project) {
                // Project exists
                req.flash('error_msg','Project is Already Registered');
                res.render('admin',{
                    projectName, location, projectDescription, startDate, endDate, projectUsername, projectPassword, username
                });
            } else {
                const newProject = new Project({
                    projectName, location, projectDescription, startDate, endDate, projectUsername, projectPassword, username
                });

                newProject.save()
                    .then(project=>{
                        req.flash('success_msg','Project are now registered');
                        res.redirect('/admin');
                    });
            }
        });
});


//register handle
router.post('/registeradmin', (req,res)=>{
    const {username, password } = req.body;
    let errors = [];

    //check pass length
    if(password.length<8){
        errors.push({msg:'Password should be at least 8 characters!!!'});
    }

    if (errors.length>0){
        res.render('',{
            errors,
            username,
            password
        });
        console.log(errors);
    } else {
        //validation passed
        Admin.findOne({ username: username })
        .then(user => {
            if(user) {
                // User exists
                errors.push({msg: "username is already registered"});
                res.render('',{
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
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newAdmin.password, salt,(err, hash)=>{
                    if(err) throw err;
                    //set password to ahshed
                    newAdmin.password = hash;
                    //save user
                    newAdmin.save()
                    .then(admin=>{
                        req.flash('success_msg','You are now registered and can log in');
                        res.redirect('/loginadmin');
                    })
                    .catch(err=>console.log(err));
                }));
            }
        });
    }
});

//Admin Login handle
router.post('/loginadmin',(req,res,next)=>{
    passport.authenticate('local-admin',{
     successRedirect: '/admin',
     failureRedirect: '/loginadmin',
     failureFlash: true,
    }) (req, res, next);
});

//Admin logout handle
router.get('/logoutadmin',(req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/loginadmin');
});

//delete project
router.delete('/admin', async (req,res)=>{
    await Project.deleteOne({projectUsername: req.body.projectUsername})
    .then((result)=>{
    req.flash('success_msg','Project berhasil dihapus!');
    res.redirect('/admin');
    });
});

//edit project
router.get('/admin/edit/:projectUsername', async (req,res)=>{
    console.log(req.params.projectUsername);
    const project = await Project.findOne({projectUsername: req.params.projectUsername});
    res.render('admineditproject',{
        project,
    });
});


router.put('/admin',[
    body('projectUsername').custom(async(value,{ req })=>{
        const duplikat = await Project.findOne({projectUsername: value});
        if(value!== req.body.oldprojectUsername && duplikat){
            throw new Error ('Nama kontak sudah digunakan');
        }
        return true;
    }),
],
(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('admineditproject',{
            errors:errors.array(),
            project:req.body,
        });
    } else{
        Project.updateOne({ _id: req.body._id },
            {
                $set : {
                    projectName : req.body.projectName,
                    location : req.body.location,
                    projectDescription : req.body.projectDescription,
                    startDate : req.body.startDate,
                    endDate : req.body.endDate,
                    username : req.body.username,
                    projectUsername : req.body.projectUsername,
                    projectPassword : req.body.projectPassword,
                    progrestotal : req.body.progrestotal,
                },
            }
        ).then((result)=>{
        req.flash('success_msg','Data Project berhasil diubah!');
        res.redirect('/admin');
        });
    }
});


//project
router.get('/projectindex/:projectid',ensureAuthenticated,async(req,res)=>{
    try{
        const project = await Project.findOne({_id: req.params.projectid})
                .catch(error => { throw error});     
        res.render('projectindex',{
        layout: 'layout-project',
        name: req.user.name,
        jobs: req.user.jobs,
        project,
        });
    } catch (err) {
    next(err);
        }
    });

// submit comment handle
router.post('/projectcomment', async (req,res,next)=>{
    const { username, isicomment, projectid, jobs, company, picture } = req.body;
    console.log(req.body);
    const newComment = new Comment ({
        username : username,
        isicomment : isicomment,
        projectid : projectid,
        jobs : jobs,
        company : company,
        picture: picture,
    });
    newComment.save()
                    .then(project=>{
                        req.flash('success_msg','Your comment has posted');
                        res.redirect('/project/'+projectid);
                    });
});

//show comment
router.delete('/comment', async (req,res)=>{
    const { commentprojectid, projectid } = req.body;
    await Comment.deleteOne({_id: commentprojectid})
    .then((result)=>{
    req.flash('success_msg','Comment berhasil dihapus!');
    res.redirect('/project/'+projectid);
    });
});


module.exports = router;