//jshint esversion:6

var zoomOnScreen = 0; //0 = list, atau kosong, atau gamtek blom dibuka
var locationOnScreen = 0;
window.listGamtekSaya = 0;
window.rowfile = 4;
window.colfile = 6;


//buka button simple

function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

//untuk assign category gamtek
function filterGamtek(btn) {
  const category = btn.value;
  document.querySelector("#category-uploadgamtekclient").value = category;
}

//buka button construction drawing, nnti di upgrade ke location
let strDrawingIndicator = 1;
let arsDrawingIndicator = 1;
let mepDrawingIndicator = 1;
let gamtekFileNameArray = [];

function gamtekSaya(zoneid, story) {

  window.locationOnScreen = zoneid;
  const dir = '/project/' + projectid + '/drawing/' + zoneid + '/' + story;

  socket.emit("numOfFilesData", projectid, zoneid, story, function(response) {
    gamtekFileNameArray = response.gamtekFileNameArray;
    const zoneRapih = response.zoneRapih;

    document.querySelector('.gamtek-grid-div').innerHTML = `
      <div class="gamtek-grid-instruction-div">
        <h4> Construction Drawing </h4>
        <span class="marg-bot-1-rem">Zone ${zoneRapih} > Story ${story}</span>
        <br>
        <span>
          Filter:
            <input type="checkbox" checked="checked" name="show-gamtek-filter" id="show-gamtek-filter-str" class="show-gamtek-filter-str" onclick="showGamtekFiltered(this)" value="STR">
            <span for="show-gamtek-filter-str">Struktur</span>
            <input type="checkbox" checked="checked" name="show-gamtek-filter" id="show-gamtek-filter-ars" class="show-gamtek-filter-ars" onclick="showGamtekFiltered(this)" value="ARS">
            <span for="show-gamtek-filter-ars-filter">Arsitektur</span>
            <input type="checkbox" checked="checked" name="show-gamtek-filter" id="show-gamtek-filter-mep" class="show-gamtek-filter-mep" onclick="showGamtekFiltered(this)" value="MEP">
            <span for="show-gamtek-filter-mep">MEP</span>
        </span>
      </div>
      `;
    if (gamtekFileNameArray.length !== 0) {
      gamtekFileNameArray.forEach(file => {
        const drawingCategoryz0 = file.substring(0, 6);

        if (drawingCategoryz0 === "STR_z0") {
          const drawingCategory = file.substring(0, 3);
          document.querySelector('.gamtek-grid-div').innerHTML += `
                  <div class="foto-gamtek col-4 foto-gamtek-str">
                    <img onclick="gamtekFullscreen(this)" class="gamtek-grid list" name="${drawingCategory}" src="/project/${projectid}/drawing/${zoneid}/${story}/${file}" alt="Page${strDrawingIndicator}" id="Page${strDrawingIndicator}">
                  </div>
                `;
          strDrawingIndicator++;
        }

        if (drawingCategoryz0 === "ARS_z0") {
          const drawingCategory = file.substring(0, 3);
          document.querySelector('.gamtek-grid-div').innerHTML += `
                  <div class="foto-gamtek col-4 foto-gamtek-ars">
                    <img onclick="gamtekFullscreen(this)" class="gamtek-grid list" name="${drawingCategory}" src="/project/${projectid}/drawing/${zoneid}/${story}/${file}" alt="Page${arsDrawingIndicator}" id="Page${arsDrawingIndicator}">
                  </div>
                `;
          arsDrawingIndicator++;
        }

        if (drawingCategoryz0 === "MEP_z0") {
          const drawingCategory = file.substring(0, 3);
          document.querySelector('.gamtek-grid-div').innerHTML += `
                  <div class="foto-gamtek col-4 foto-gamtek-mep">
                    <img onclick="gamtekFullscreen(this)" class="gamtek-grid list" name="${drawingCategory}" src="/project/${projectid}/drawing/${zoneid}/${story}/${file}" alt="Page${mepDrawingIndicator}" id="Page${mepDrawingIndicator}">
                  </div>
                `;
          mepDrawingIndicator++;
        }
      });

    } else {
      document.querySelector('.gamtek-grid-div').innerHTML += `
            <h4 class="text-center"> No construction drawing uploaded </h4>
          `;
    }
  });

  document.querySelector(".gamtek-grid-bg").addEventListener("click", () => {
    document.querySelector('.gamtek-grid-div').innerHTML = "";
    document.querySelector(".gamtek-grid-super-div").classList.remove("gamtek-grid-super-div-active");
    document.querySelector(".gamtek-grid-div").classList.remove("gamtek-grid-div-active");
    document.querySelector(".gamtek-grid-bg").classList.remove("gamtek-grid-bg-active");
    strDrawingIndicator = 1;
    arsDrawingIndicator = 1;
    mepDrawingIndicator = 1;
  });

  document.querySelector(".gamtek-grid-super-div").classList.add("gamtek-grid-super-div-active");
  document.querySelector(".gamtek-grid-div").classList.add("gamtek-grid-div-active");
  document.querySelector(".gamtek-grid-bg").classList.add("gamtek-grid-bg-active");
}

//untuk show gamtek sesuai filter
let showGamtekFilteredIndicatorStr = true;
let showGamtekFilteredIndicatorArs = true;
let showGamtekFilteredIndicatorMep = true;
//
function showGamtekFiltered(category) {

  if (category.value === "STR") {
    if (showGamtekFilteredIndicatorStr === false) {
      document.querySelectorAll(".foto-gamtek-str").forEach(foto => {
        foto.style.display = "inline-block";
      });
      showGamtekFilteredIndicatorStr = true;
    } else {
      document.querySelectorAll(".foto-gamtek-str").forEach(foto => {
        foto.style.display = "none";
      });
      showGamtekFilteredIndicatorStr = false;
    }
  }

  if (category.value === "ARS") {
    if (showGamtekFilteredIndicatorArs === false) {
      document.querySelectorAll(".foto-gamtek-ars").forEach(foto => {
        foto.style.display = "inline-block";
      });
      showGamtekFilteredIndicatorArs = true;
    } else {
      document.querySelectorAll(".foto-gamtek-ars").forEach(foto => {
        foto.style.display = "none";
      });
      showGamtekFilteredIndicatorArs = false;
    }
  }

  if (category.value === "MEP") {
    if (showGamtekFilteredIndicatorMep === false) {
      document.querySelectorAll(".foto-gamtek-mep").forEach(foto => {
        foto.style.display = "inline-block";
      });
      showGamtekFilteredIndicatorMep = true;
    } else {
      document.querySelectorAll(".foto-gamtek-mep").forEach(foto => {
        foto.style.display = "none";
      });
      showGamtekFilteredIndicatorMep = false;
    }
  }
}

function filterGamtek(btn) {
  const category = btn.value;
  document.querySelector("#category-uploadgamtekclient").value = category;
}

//fungsi general munculin gamtek
function gamtekFullscreen(img) {

  const srccompressed = img.src;
  const srcsplitfirst = srccompressed.split("_");
  const src = srcsplitfirst[0] + '_z3_' + srcsplitfirst[2] + '_' + srcsplitfirst[3];

  document.querySelector(".gamtek-fullscreen-super-div").innerHTML = `
    <div class="gamtek-fullscreen-div">
      <div class="zoom-btn-gamtek">
        <i class="fas fa-search-plus fa-3x zoomingambar"></i>
        <br>
        <i class="fas fa-search-minus fa-3x zoomoutgambar"></i>
        <br>
        <i class="far fa-times-circle fa-3x close-gamtek-fullscreen-btn"></i>
      </div>
      <div class="gamtek-fullscreen-content" >
        <img ondragstart="return false" class="zoom-img" id="zoom-img" src="${src}" style="width: auto; height: 600px;" />
      </div>
      <div class="gamtek-fullscreen-bg">
      </div>
    </div>
  `;

  document.querySelector(".gamtek-fullscreen-bg").addEventListener("click", () => {
    document.querySelector(".gamtek-fullscreen-div").remove();
  });
  document.querySelector(".close-gamtek-fullscreen-btn").addEventListener("click", () => {
    document.querySelector(".gamtek-fullscreen-div").remove();
  });

  let img_ele = null,
    x_cursor = 0,
    y_cursor = 0,
    x_img_ele = 0,
    y_img_ele = 0,
    orig_width = 0,
    orig_height = 0,
    current_left = 0,
    current_top = 0,
    zoom_factor = 1.0;

  document.getElementById('zoom-img').onload = function() {
    orig_width = document.getElementById('zoom-img').clientWidth;
    orig_height = document.getElementById('zoom-img').clientHeight;
  };

  function zoom(zoomincrement) {
    img_ele = document.getElementById('zoom-img');
    zoom_factor = zoom_factor + zoomincrement;
    if (zoom_factor <= 1.0) {
      zoom_factor = 1.0;
      img_ele.style.top = '0px';
      img_ele.style.left = '0px';
    }
    var pre_width = img_ele.getBoundingClientRect().width,
      pre_height = img_ele.getBoundingClientRect().height;

    var new_width = (orig_width * zoom_factor);
    var new_heigth = (orig_height * zoom_factor);

    if (current_left < (orig_width - new_width)) {
      current_left = (orig_width - new_width);
    }
    if (current_top < (orig_height - new_heigth)) {
      current_top = (orig_height - new_heigth);
    }
    img_ele.style.left = current_left + 'px';
    img_ele.style.top = current_top + 'px';
    img_ele.style.width = new_width + 'px';
    img_ele.style.height = new_heigth + 'px';

    img_ele = null;
  }

  function start_drag() {
    if (zoom_factor <= 1.0) {
      return;
    }
    img_ele = this;
    x_img_ele = window.event.clientX - document.getElementById('zoom-img').offsetLeft;
    y_img_ele = window.event.clientY - document.getElementById('zoom-img').offsetTop;
  }

  function stop_drag() {
    if (img_ele !== null) {
      if (zoom_factor <= 1.0) {
        img_ele.style.left = '0px';
        img_ele.style.top = '0px';
      }
    }
    img_ele = null;
  }

  function while_drag() {
    if (img_ele !== null) {
      var x_cursor = window.event.clientX;
      var y_cursor = window.event.clientY;

      var new_left = (x_cursor - x_img_ele);
      if (new_left < (orig_width - img_ele.width)) {
        new_left = (orig_width - img_ele.width);
      }

      var new_top = (y_cursor - y_img_ele);
      if (new_top < (orig_height - img_ele.height)) {
        new_top = (orig_height - img_ele.height);
      }

      current_left = new_left;
      img_ele.style.left = new_left + 'px';
      current_top = new_top;
      img_ele.style.top = new_top + 'px';
    }
  }

  document.querySelector('.zoomoutgambar').addEventListener('click', function() {
    zoom(-0.25);
  });
  document.querySelector('.zoomingambar').addEventListener('click', function() {
    zoom(0.25);
  });

  document.querySelector('.zoom-img').addEventListener('mousedown', start_drag);
  document.querySelector('.zoom-img').addEventListener('mousemove', while_drag);
  document.querySelector('.zoom-img').addEventListener('mouseup', stop_drag);
  document.querySelector('.zoom-img').addEventListener('mouseout', stop_drag);



  //       var table = document.createElement('table'), tr, td, row, cell;
  //       // table.setAttribute= ('border','0');
  //        table.setAttribute ('cellpadding','0');
  //        // table.setAttribute= ('cellspacing','0');
  //         for (row = 0; row < window.rowfile; row++) {
  //           tr = document.createElement('tr');
  //           for (cell = 0; cell < window.colfile; cell++) {
  //               td = document.createElement('td');
  //               tr.appendChild(td);
  //               nomor = row * colfile + cell + 1;
  //               // path = "/drawing/"+window.idOnScreen+"/z" + window.zoomOnScreen + "/"+nomor+'.png';
  //               path = "/project/dataset/drawing/KM-"+window.locationOnScreen+"/"+window.idOnScreen+"/z" + window.zoomOnScreen + "/images/"+nomor+'.jpg';
  //               //kalau udah bisa perlocation, ganti
  //               td.innerHTML = '<img src="'+path+'">';

  //           }
  //           table.appendChild(tr);
  //       }
  //       document.querySelector('.gamtekfsshow').appendChild(table);
}

// // //jquery lazy photo load
// // $("img").load(function(){
// //   $(this).load(function(){
// //     this.style.opacity=1;
// //   });
// // });

//fungsi general apusin gamtek
// function apusinTabel() {
//   document.querySelector('.gamtekfsshow').remove();
//   document.querySelector('.gamtekfs').innerHTML += '<div class="gamtekfsshow"></div>';
// }

// //fungsi zoom out
//     zoomout.addEventListener('click', function(e){
//       window.zoomOnScreen-=1;
//       if(zoomOnScreen === 2){

//            munculinTabel();
//         }
//         else if(zoomOnScreen === 1) {

//            munculinTabel();
//         }
//         else if(zoomOnScreen === 3) {

//            munculinTabel();
//            //munculin zoomin class
//            zoomin.classList.remove("zoominbefore");
//            zoomin.classList.add("zoominafter");
//         }
//         else if(zoomOnScreen === 4) {

//            munculinTabel();
//         }
//         else if(zoomOnScreen === 0) {

//            apusinTabel();
//            zoomout.classList.remove("zoomoutafter");
//            zoomout.classList.add("zoomoutbefore");
//            zoomin.classList.remove("zoominafter");
//            zoomin.classList.add("zoominbefore");
//         };

//     console.log(window.zoomOnScreen);
//     });

// //fungsi zoom in
//   zoomin.addEventListener('click', function(e) {

//       window.zoomOnScreen+=1;
//       if(zoomOnScreen === 2){

//         }
//         else if(zoomOnScreen === 1) {

//         }
//         else if(zoomOnScreen === 3) {

//         }
//         else if(zoomOnScreen === 4) {

//            //apus zoomin class
//            zoomin.classList.remove("zoominafter");
//            zoomin.classList.add("zoominbefore");
//         };

//       munculinTabel();

//   console.log(window.zoomOnScreen);
// });
