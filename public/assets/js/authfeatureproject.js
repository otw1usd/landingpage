//jshint esversion: 8
const rolediv = document.querySelector('.getRole').value.split(",");


//project
function removeButtonDeleteProject() {

}

function addButtonDeleteProject() {
  document.getElementById('dom-deleteproject').innerHTML = `
    <button type="submit" class="btn btn-outline-warning button-info-container row">
      <div class="col-1 logo">
        <i class="fas fa-trash-alt"></i>
      </div>
      <div class="col-10 keterangan">Delete Project</div>
    </button>
  `;

}

rolediv.forEach(role => {
  //owner
  if (role === 'Owner') {
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
});
