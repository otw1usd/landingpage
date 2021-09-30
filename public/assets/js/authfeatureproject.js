//jshint esversion: 8
const rolediv = document.querySelector('.getRole');
const role = rolediv.value;
console.log(role);

//project
function addButtonAddUsername() {
  document.getElementById('domButtonConsultant').innerHTML = '<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Consultant</button>';
  document.getElementById('domButtonContractor').innerHTML = '<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Contractor</button>';
  document.getElementById('domButtonDroneEngineer').innerHTML = '<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Drone Engineer</button>';
  document.getElementById('domButtonMember').innerHTML = '<button type="button" class="btn btn-warning btn-sm add-username" onclick="addUsername(this)" id="">Tambah Username Member</button>';
  console.log('addButtonAddUsername success');
}

function addButtonDeleteUsername() {
  document.querySelectorAll('.domButtonDeleteUsername').forEach(domButtonDeleteUsername => {
    domButtonDeleteUsername.innerHTML = '<button type="submit" class="btn btn-danger badge delete-username" onclick="return confirm(\'Are you sure you want to delete this username?\')">X</button>';
    console.log('addButtonDeleteUsername success');
  });
};

function removeButtonDeleteProject(){

};

function addButtonDeleteProject(){
  document.getElementById('dom-deleteproject').innerHTML = '<div class="btn btn-outline-warning button-info-container row"><div class="col-1 logo"><i class="fas fa-database"></i></div><button type="submit" class="col-10 keterangan" style="border:0px; background-color: transparent;color:#ffc107;" onclick="return confirm(\'Are you sure to delete this project??\')">Delete Project</button>'

};

//owner
if (role === 'Owner') {
  addButtonAddUsername();
  addButtonDeleteUsername();
  addButtonDeleteProject();
}

//consultant
if (role === 'Consultant') {

}

//contractor
if (role === 'Contractor') {}

//droneengineer
if (role === 'Drone Engineer') {

}

//member
if (role === 'Member') {

}
