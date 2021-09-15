const Admin = require('../model/admin');

module.exports={
    adminEnsureAuthenticated: async function(req, res, next){
        if(!req.isAuthenticated()){
            req.flash('error_msg','Please log in !');
            res.redirect('/loginadmin');
        } else{
            await Admin.find({username:req.user.username}).then(adminlogedin=>{
            
                if(adminlogedin.length === 0){
                    req.flash('error_msg','Please log in !');
                    res.redirect('/loginadmin');
                } else{  
                    next();            
                    };
            }); 
        }
    }
}