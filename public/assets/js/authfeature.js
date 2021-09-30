
const rolediv = document.querySelector('.getRole');
const role = rolediv.value;
console.log(role);

//project
async function removeButtonAddUsername (){
    await document.querySelectorAll('.add-username').remove;
    console.log('removeButtonAddUsername success');
};
 function addButtonAddUsername(){
    document.getElementById('domButtonConsultant').innerHTML +='<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Consultant</button>';document.getElementById('domButtonContractor').innerHTML +='<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Contractor</button>';
    document.getElementById('domButtonDroneEngineer').innerHTML +='<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Drone Engineer</button>';
    document.getElementById('domButtonMember').innerHTML +='<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Member</button>';
    console.log('addButtonAddUsername success');
};
async function removeButtonDeleteUsername(){
    await document.querySelectorAll('.delete-username').remove;
    console.log('removeButtonDeleteUsername success');
};
function addButtonDeleteUsername(){
    document.querySelectorAll('.domButtonDeleteUsername').innterHTML +='<button type="submit" class="btn btn-danger badge delete-username" onclick="return confirm(\'Are you sure delete this username??\')">X</button>';
    console.log('addButtonDeleteUsername success');
};


//projectindex
async function removeButtonInsertTimestamp(){
    await document.querySelector('.toggle-client-side-input-timestamp').remove;
    console.log('removeButtonInsertTimestamp success');
};

 function addButtonInsertTimestamp(){
    document.querySelector('.dom-input-timestamp').innerHTML += '<button class="btn btn-outline-warning btn-sm btn-block toggle-client-side-input-timestamp" onclick="toggleClientSideInputTimestamp()">Input Timestamp</button>';
    console.log('addButtonInsertTimestamp success');
};

async function removeButtonInsertProjectZone(){
    await document.querySelector('.toggle-client-side-input-projectzone').remove;
    console.log('removeButtonInsertProjectZone success');
};

async function addButtonInsertProjectZone(){
    document.querySelector('.dom-input-projectzone').innerHTML += '<button class="btn btn-outline-warning btn-sm btn-block toggle-client-side-input-projectzone" onclick="toggleClientSideInputProjectZone()">Input Project Zone</button>';
    console.log('addButtonInsertProjectZone success');
};

async function removeButtonInsertDroneData(){
    await document.querySelector('.toggle-client-side-input-dronedata').remove;
    console.log('removeButtonInsertDroneData success');
};

async function addButtonInsertDroneData(){
    document.querySelector('.dom-input-dronedata').innerHTML+= '<button class="btn btn-outline-warning btn-sm btn-block toggle-client-side-input-dronedata" onclick="toggleClientSideInputDroneData()">Input Drone Data</button>';
    console.log('addButtonInsertDroneData success');

};

removeButtonAddUsername();
removeButtonDeleteUsername();
removeButtonInsertTimestamp();
removeButtonInsertDroneData();
removeButtonInsertProjectZone();
removeButtonInsertTimestamp();

//owner
if (role === 'Owner'){
    addButtonAddUsername();
    addButtonDeleteUsername();
    
    

    
}


//consultant
if (role === 'Consultant'){
    addButtonInsertTimestamp();
    addButtonInsertProjectZone();
    
}

//contractor
if (role === 'Contractor'){
}

//droneengineer
if (role === 'Drone Engineer'){
    addButtonInsertDroneData()
}

//member
if (role === 'Member'){

}
