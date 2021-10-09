//jshint esversion:6

const listGamtek = document.querySelector('.gamtek');
const zoomin = document.querySelector('.zoominbefore');
const zoomout = document.querySelector('.zoomoutbefore');

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

//untuk assign category gamtek dan ambil source gamtek
function filterGamtek(btn) {
  const category = btn.value;
  document.querySelector("#category-uploadgamtekclient").value = category;
}

function getSrc(gamtek) {
  const src = gamtek.src;
  const srcsplitfirst = src.split("_");
  console.log(srcsplitfirst);
  const srcnotcompressed = srcsplitfirst[0] + '_z3_' + srcsplitfirst[2] + '_' + srcsplitfirst[3];


  munculinTabel(srcnotcompressed);

  document.querySelector(".gamtek-fullscreen-bg").addEventListener("click", () => {
    document.querySelector("#zoom-img").remove();
    document.querySelector(".zoomoutafter").classList.add("zoomoutbefore");
    document.querySelector(".zoomoutafter").classList.remove("zoomoutafter");
    document.querySelector(".zoominafter").classList.add("zoominbefore");
    document.querySelector(".zoominafter").classList.remove("zoominafter");
  });
}

//buka button construction drawing, nnti di upgrade ke location
let strDrawingIndicator = 1;
let arsDrawingIndicator = 1;
let mepDrawingIndicator = 1;

function gamtekSaya(zoneid, story) {

  window.locationOnScreen = zoneid;
  const dir = '/project/' + projectid + '/drawing/' + zoneid + '/' + story;

  socket.emit("numOfFilesData", projectid, zoneid, story, function(response) {
    const gamtekFileNameArray = response.gamtekFileNameArray;
    const zoneRapih = response.zoneRapih;
    document.querySelector('.gamtek-grid-div').innerHTML = `
          <div class="gamtek-grid-instruction-div">
            <h4> Construction Drawing </h4>
            <span class="marg-bot-1-rem">Zone ${zoneRapih} > Story ${story}</span>
            <br>
            <span>
              Filter:
                <input type="checkbox" id="show-gamtek-filter-str" onclick="" value="STR">
                <span for="show-gamtek-filter-str">Struktur</span>
                <input type="checkbox" id="show-gamtek-filter-ars" onclick="" value="ARS">
                <span for="show-gamtek-filter-ars-filter">Arsitektur</span>
                <input type="checkbox" id="show-gamtek-filter-mep" onclick="" value="MEP">
                <span for="show-gamtek-filter-mep">MEP</span>
            </span>
          </div>
      `;
    if (gamtekFileNameArray.length !== 0) {
      gamtekFileNameArray.forEach(file => {
        const drawingCategoryz0 = file.substring(0, 6);

        if (drawingCategoryz0 === "STR_z0") {
          const drawingCategory = file.substring(0,3);
          document.querySelector('.gamtek-grid-div').innerHTML += `
                  <div class="foto-gamtek col-4">
                    <img onclick="getSrc(this)" class="gamtek-grid list" name="${drawingCategory}" src="/project/${projectid}/drawing/${zoneid}/${story}/${file}" alt="Page${strDrawingIndicator}" id="Page${strDrawingIndicator}">
                  </div>
                `;
          strDrawingIndicator++;
        }

        if (drawingCategoryz0 === "ARS_z0") {
          const drawingCategory = file.substring(0,3);
          document.querySelector('.gamtek-grid-div').innerHTML += `
                  <div class="foto-gamtek col-4">
                    <img onclick="getSrc(this)" class="gamtek-grid list" name="${drawingCategory}" src="/project/${projectid}/drawing/${zoneid}/${story}/${file}" alt="Page${arsDrawingIndicator}" id="Page${arsDrawingIndicator}">
                  </div>
                `;
          arsDrawingIndicator++;
        }

        if (drawingCategoryz0 === "MEP_z0") {
          const drawingCategory = file.substring(0,3);
          document.querySelector('.gamtek-grid-div').innerHTML += `
                  <div class="foto-gamtek col-4">
                    <img onclick="getSrc(this)" class="gamtek-grid list" name="${drawingCategory}" src="/project/${projectid}/drawing/${zoneid}/${story}/${file}" alt="Page${mepDrawingIndicator}" id="Page${mepDrawingIndicator}">
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


function filterGamtek(btn) {
  const category = btn.value;
  document.querySelector("#category-uploadgamtekclient").value = category;
}

//kalo pencet dari list gamtek
// listGamtek.addEventListener('click', function(e) {
//   window.idOnScreen = e.target.id;
//
//   if (window.zoomOnScreen === 0) {
//     zoomout.classList.remove("zoomoutbefore");
//     zoomout.classList.add("zoomoutafter");
//     zoomin.classList.remove("zoominbefore");
//     zoomin.classList.add("zoominafter");
//     // window.zoomOnScreen = +1;
//
//     munculinTabel();
//   }

// kalo list dipencet tpi udah ada yang kebuka
//   else {
//     munculinTabel();
//   }
//
// });

//fungsi general munculin gamtek
function munculinTabel(src) {
  // document.querySelector('.gamtekfsshow').remove();
  // document.querySelector('.gamtekfs').innerHTML += '<div class="gamtekfsshow"> </div>';
  zoomout.classList.remove("zoomoutbefore");
  zoomout.classList.add("zoomoutafter");
  zoomin.classList.remove("zoominbefore");
  zoomin.classList.add("zoominafter");

  document.querySelector(".gamtek-fullscreen-super-div").innerHTML = `
    <div class="gamtek-fullscreen-div">
      <div class="gamtek-fullscreen-content">
        <img ondragstart="return false" class="zoom-img" id="zoom-img" src="${src}" />
      </div>
      <div class="gamtek-fullscreen-bg">
      </div>
    </div>
  `;

  document.querySelector(".gamtek-fullscreen-bg").addEventListener("click", () => {
    document.querySelector(".gamtek-fullscreen-div").remove();
  });

  var img_ele = null,
    x_cursor = 0,
    y_cursor = 0,
    x_img_ele = 0,
    y_img_ele = 0,
    orig_width = document.getElementById('zoom-img').getBoundingClientRect().width,
    orig_height = document.getElementById('zoom-img').getBoundingClientRect().height,
    current_top = 0,
    current_left = 0,
    zoom_factor = 1.0;

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
    // console.log('prewidth=' + img_ele.getBoundingClientRect().width + '; pre_height =' + img_ele.getBoundingClientRect().height);
    //  img_ele.style.width = (pre_width * zoomincrement) + 'px';
    //  img_ele.style.height = (pre_height * zoomincrement) + 'px';
    var new_width = (orig_width * zoom_factor);
    var new_heigth = (orig_height * zoom_factor);

    // console.log('postwidth=' + img_ele.style.width + '; postheight =' + img_ele.style.height);

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
    // console.log('img=' + img_ele.toString() + '; x_img_ele=' + x_img_ele + '; y_img_ele=' + y_img_ele + ';');
    // console.log('offLeft=' + document.getElementById('zoom-img').offsetLeft + '; offTop=' + document.getElementById('zoom-img').offsetTop);
  }

  function stop_drag() {
    if (img_ele !== null) {
      if (zoom_factor <= 1.0) {
        img_ele.style.left = '0px';
        img_ele.style.top = '0px';
      }
      // console.log(img_ele.style.left + ' - ' + img_ele.style.top);
    }
    img_ele = null;
  }

  function while_drag() {
    if (img_ele !== null) {
      var x_cursor = window.event.clientX;
      var y_cursor = window.event.clientY;
      var new_left = (x_cursor - x_img_ele);
      if (new_left > 0) {
        new_left = 0;
      }
      if (new_left < (orig_width - img_ele.width)) {
        new_left = (orig_width - img_ele.width);
      }
      var new_top = (y_cursor - y_img_ele);
      if (new_top > 0) {
        new_top = 0;
      }
      if (new_top < (orig_height - img_ele.height)) {
        new_top = (orig_height - img_ele.height);
      }
      current_left = new_left;
      img_ele.style.left = new_left + 'px';
      current_top = new_top;
      img_ele.style.top = new_top + 'px';

      // console.log(img_ele.style.left + ' - ' + img_ele.style.top);
    }
  }

  document.querySelector('.zoomoutgambar').addEventListener('click', function() {
    zoom(-0.25);
    // console.log('zoomed-out');
  });
  document.querySelector('.zoomingambar').addEventListener('click', function() {
    zoom(0.25);
    // console.log('zoomed-in');
  });

  document.querySelector('.zoom-img').addEventListener('mousedown', start_drag);
  document.querySelector('.gamtekfsshow').addEventListener('mousemove', while_drag);
  document.querySelector('.gamtekfsshow').addEventListener('mouseup', stop_drag);
  document.querySelector('.gamtekfsshow').addEventListener('mouseout', stop_drag);

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
function apusinTabel() {
  document.querySelector('.gamtekfsshow').remove();
  document.querySelector('.gamtekfs').innerHTML += '<div class="gamtekfsshow"></div>';
}

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
