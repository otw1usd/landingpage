const express = require ('express');
const router = express.Router();
// const { body, validationResult, check } = require ('express-validator');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth')

const User = require('../model/user');
const bcrypt = require ('bcryptjs');

router.get('/', (req,res) => res.render ('index'));
router.get('/login',(req,res)=>res.render('login'));
router.get('/beranda', ensureAuthenticated,(req,res)=>res.render('beranda',{
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
}));
router.get('/daftarproyek', ensureAuthenticated,(req,res)=>res.render('daftarproyek',{
    name: req.user.name,
    jobs: req.user.jobs,
    company: req.user.company,
}));

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
                }))
            }
        });
    }
});

//Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
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


module.exports = router;