//jshint esversion: 8
const rolediv = document.querySelector('.getRole').value.split(",");

//projectindex
function addButtonInsertTimestamp() {
  document.querySelector('.dom-input-timestamp').innerHTML = '<button class="btn btn-outline-warning btn-sm btn-block toggle-client-side-input-timestamp" onclick="toggleClientSideInputTimestamp()">Input Timestamp</button>';
  console.log('addButtonInsertTimestamp success');
}

function addButtonInsertProjectZone() {
  document.querySelector('.dom-input-projectzone').innerHTML = '<button class="btn btn-outline-warning btn-sm btn-block toggle-client-side-input-projectzone" onclick="toggleClientSideInputProjectZone()">Input Project Zone</button>';
  console.log('addButtonInsertProjectZone success');
}

function addButtonInsertDroneData() {
  document.querySelector('.dom-input-dronedata').innerHTML = '<button class="btn btn-outline-warning btn-sm btn-block toggle-client-side-input-dronedata" onclick="toggleClientSideInputDroneData()">Input Drone Data</button>';
  console.log('addButtonInsertDroneData success');

}

function addButtonViewConstructionDrawing(){

};

function addButtonAddConstructionDrawing(){

};

function addButtonViewProjectMember(){


};


rolediv.forEach(role => {
  //owner
  if (role === 'Owner') {
  }

  //consultant
  if (role === 'Consultant') {
    addButtonInsertTimestamp();
    addButtonInsertProjectZone();
  }

  //contractor
  if (role === 'Contractor') {}

  //droneengineer
  if (role === 'Drone Engineer') {
    addButtonInsertDroneData();
    addButtonInsertTimestamp();
    addButtonInsertProjectZone();
  }

  //member
  if (role === 'Member') {

  }
});
