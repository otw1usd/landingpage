const Project = require('../model/project');

const findproject = async (a) => {
    let listprojects = [];
    const listprojectOwner = await Project.find({
        username : a
    });

    const listprojectConsultant = await Project.find({
        consultant : a
    });

    const listprojectContractor = await Project.find({
        contractor : a
    });

    const listprojectDroneengineer = await Project.find({
        droneengineer : a
    });

    const listprojectMember = await Project.find({
        member : a
    });

    if (listprojectOwner !== [null]){
        if (listprojectOwner.length!== 0){
        listprojects.push(listprojectOwner)
        }
    };

    if (listprojectConsultant !== [null]){
        if (listprojectConsultant.length!== 0){
        listprojects.push(listprojectConsultant)
        }
    };

    if (listprojectDroneengineer !== [null]){
        if (listprojectDroneengineer.length!== 0){
        listprojects.push(listprojectDroneengineer)
        }
    };

    if (listprojectContractor !== [null]){
        if (listprojectContractor.length!== 0){
        listprojects.push(listprojectContractor)
        }
    };

    if (listprojectMember !== [null]){
        if (listprojectMember.length!== 0){
        listprojects.push(listprojectMember)
        }
    };

    return listprojects;
};


module.exports = { findproject };
