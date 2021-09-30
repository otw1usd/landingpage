const Project = require('../model/project');

function check (a,b,c,d){
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b) {c.push(d)};
}};

const projectindexAuth = async (req, res, next) => {
    const listproject = await Project.findOne({
        _id : req.params.projectid
    });
    const userUsername = req.user.username;
    const listconsultant = await listproject.consultant;
    const listcontractor = await listproject.contractor;
    const listdroneengineer = await listproject.droneengineer;
    const listmember = await listproject.member;
    const role=[];

    //nextnya dikasi parameter
    const consultant = 'consultant';
    const contractor = 'contractor';
    const droneengineer = 'droneengineer';
    const member = 'member';
    //check username
    if (listproject.username === req.user.username) {role.push('owner')};
    check(listconsultant,userUsername,role,consultant);
    check(listcontractor,userUsername,role,contractor);
    check(listdroneengineer,userUsername,role,droneengineer);
    check(listmember,userUsername,role,member);

    if (role.length ===0) {
        req.flash('error_msg', "You don't have access to the project");
        res.redirect('/beranda');
    };
    return next();
};


module.exports = { projectindexAuth };