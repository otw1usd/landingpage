const Project = require('../model/project');

function check (a,b,c,d){
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b) {c.push(d)};
}};

const findrole = async (projectid,username) => {
    const listproject = await Project.findOne({
        _id : projectid
    });
    let role=[];

    const listconsultant = await listproject.consultant;
    const listcontractor = await listproject.contractor;
    const listdroneengineer = await listproject.droneengineer;
    const listmember = await listproject.member;

    const consultant = 'Consultant';
    const contractor = 'Contractor';
    const droneengineer = 'Drone Engineer';
    const member = 'Member';
    //check username
    if (listproject.username === username) {role.push('Owner')};
    check(listconsultant,username,role,consultant);
    check(listcontractor,username,role,contractor);
    check(listdroneengineer,username,role,droneengineer);
    check(listmember,username,role,member);
    return(role);
};


module.exports = { findrole };
