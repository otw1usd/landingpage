const Admin = require('../model/admin');

module.exports={
    adminEnsureAuthenticated: async function(req, res, next){
        if(!req.isAuthenticated()){
            req.flash('error_msg','Please log in !');
            res.redirect('/loginadmin');
            console.log('galewat yg pertama');
        } else{
            await Admin.find({username:req.user.username}).then(adminlogedin=>{
            
                if(adminlogedin.length === 0){
                    console.log('gabolehlogin');
                    req.flash('error_msg','Please log in !');
                    res.redirect('/loginadmin');
                } else{
                    console.log('boleh login');   
                    next();            
                    };
            }); 
        }
    }
}