const Project = require('../model/project');

function check (a,b,c,d){
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b) {c.push(d)};
}

async function cekcekcek (req, res, next){
    const listproject = await Project.findOne({
        _id : req.params.oit
    });
    const userUsername = await req.user.username;
    const listconsultant = await listproject.consultant;
    const listcontractor = await listproject.contractor;
    const listdroneengineer = await listproject.droneengineer;
    const listmember = await listproject.member;
    let role=[];

    //nextnya dikasi parameter

    //check username
    if (listproject.username === req.user.username) {role.push('owner')}
    await check(listconsultant,userUsername,role,consultant);
    await check(listcontractor,userUsername,role,contractor);
    await check(listdroneengineer,userUsername,role,droneengineer);
    await check(listmember,userUsername,role,member);

    console.log(role);
    return role;
    
};

const projectAuth = (req, res, next) => {
    if (!cekcekcek (req, res, next)) {
        res.redirect('/beranda');
    };
    return next();
}

module.exports = { projectAuth };