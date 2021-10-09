const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }

//Load User Model
const User = require('../model/user');
const Admin = require('../model/admin');

module.exports = function(passport){
    passport.use('local-client',
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
            // Match user
            User.findOne({ username: username})
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'That username is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        if (user.confirmed == true) {
                            return done(null, user)
                        } else {
                        return done(null, false, { message: 'Please confirm your email !'})
                        };
                    } else {
                        return done(null, false, { message: 'Password incorrect'});
                    }
                });
            });
        })
    ); 
    passport.use('local-admin',
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
            // Match admin
            Admin.findOne({ username: username})
            .then(admin => {
                if(!admin){
                    return done(null, false, { message: 'That username is not registered' });
                }

                // Match password
                bcrypt.compare(password, admin.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, admin);
                    } else {
                        return done(null, false, { message: 'Password incorrect'});
                    }
                });
                
            });
        })
    ); 

    
    passport.serializeUser(function (userObject, done) {
        // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
        let userGroup = "model1";
        let userPrototype =  Object.getPrototypeOf(userObject);
        if (userPrototype === User.prototype) {
        userGroup = "model1";
        } else if (userPrototype === Admin.prototype) {
        userGroup = "model2";
        }
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
    });
    passport.deserializeUser(function (sessionConstructor, done) {
        if (sessionConstructor.userGroup == 'model1') {
            User.findOne({
            _id: sessionConstructor.userId
        }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
        } else if (sessionConstructor.userGroup == 'model2') {
        Admin.findOne({
            _id: sessionConstructor.userId
        }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
        }
    });
}
