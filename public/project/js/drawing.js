console.log('drawing.js masuk');

const listGamtek = document.querySelector('.gamtek');
const zoomin = document.querySelector('.zoominbefore');
const zoomout = document.querySelector('.zoomoutbefore');

var zoomOnScreen = 0; //0 = list, atau kosong, atau gamtek blom dibuka
var locationOnScreen=0;
window.listGamtekSaya =0;
window.rowfile = 4;
window.colfile = 6;



//buka button simple
    function myFunction() {
      var popup = document.getElementById("myPopup");
      popup.classList.toggle("show");
    };

//buka button construction drawing, nnti di upgrade ke location


    function gamtekSaya(asd) {

      if(window.listGamtekSaya===0){

      window.locationOnScreen=asd;

      window.listGamtekSaya +=1;
      console.log(listGamtekSaya);

      document.querySelector('.loopingbatasgamtek').remove();
      document.querySelector('.popupgamtek').innerHTML+='<div class="loopingbatasgamtek"> </div>';



      for (i=1 ; i < 5 ; i++){
        //cari code itung jumlah file biar makin auto
        document.querySelector('.loopingbatasgamtek').innerHTML+='<div class="card border-dark mb-3 row"><div class="card-header">Page'+i+'</div><div class="card-body text-dark"><div class="row"><div class="foto-gamtek col-10"><img src="project/dataset/drawing/KM-'+window.locationOnScreen+'/Original PNG/z0-Page'+i+'.png" alt="Page'+i+'"" id="Page'+i+'" class="list"></div><div class="div-logo-kecil col-2"><img class="logo-kecil" src="img/download.png" alt="download"><br><img class="logo-kecil" src="img/print.png" alt="print"><br><img class="logo-kecil" src="img/share.png" alt="share"></div></div></div></div>';
      };



      var gamtek = document.getElementById("daftarGamtekSaya");
      gamtek.classList.toggle("buka");


    }
    //cek kalo locationonscreen sama, berarti nutup, kalo beda berarti buka
    else {
      window.listGamtekSaya -=1;
      document.querySelector('.loopingbatasgamtek').remove();
      document.querySelector('.popupgamtek').innerHTML+='<div class="loopingbatasgamtek"> </div>';
      var gamtek = document.getElementById("daftarGamtekSaya");
      gamtek.classList.toggle("buka");
      console.log(listGamtekSaya);



    }
    };




//kalo pencet dari list gamtek
listGamtek.addEventListener('click', function(e) {
  window.idOnScreen = e.target.id;

  if(window.zoomOnScreen === 0){
    zoomout.classList.remove("zoomoutbefore");
    zoomout.classList.add("zoomoutafter");
    zoomin.classList.remove("zoominbefore");
    zoomin.classList.add("zoominafter");
    window.zoomOnScreen =+1;

    munculinTabel();



  }

// kalo list dipencet tpi udah ada yang kebuka
  else {
    munculinTabel();
  }

});

//fungsi general munculin gamtek
function munculinTabel (){
  document.querySelector('.gamtekfsshow').remove();
  document.querySelector('.gamtekfs').innerHTML+='<div class="gamtekfsshow"></div>';

      var table = document.createElement('table'), tr, td, row, cell;
      // table.setAttribute= ('border','0');
       table.setAttribute ('cellpadding','0');
       // table.setAttribute= ('cellspacing','0');
        for (row = 0; row < window.rowfile; row++) {
          tr = document.createElement('tr');
          for (cell = 0; cell < window.colfile; cell++) {
              td = document.createElement('td');
              tr.appendChild(td);
              nomor = row * colfile + cell + 1;
              // path = "drawing/"+window.idOnScreen+"/z" + window.zoomOnScreen + "/"+nomor+'.png';
              path = "project/dataset/drawing/KM-"+window.locationOnScreen+"/"+window.idOnScreen+"/z" + window.zoomOnScreen + "/images/"+nomor+'.jpg';
              //kalau udah bisa perlocation, ganti
              td.innerHTML = '<img src="'+path+'">';

          }
          table.appendChild(tr);
      }
      document.querySelector('.gamtekfsshow').appendChild(table);
    };

// //jquery lazy photo load
// $("img").load(function(){
//   $(this).load(function(){
//     this.style.opacity=1;
//   });
// });

//fungsi general apusin gamtek
function apusinTabel (){
  document.querySelector('.gamtekfsshow').remove();
  document.querySelector('.gamtekfs').innerHTML+='<div class="gamtekfsshow"></div>';
    };


//fungsi zoom out
    zoomout.addEventListener('click', function(e){
      window.zoomOnScreen-=1;
      if(zoomOnScreen === 2){

           munculinTabel();
        }
        else if(zoomOnScreen === 1) {

           munculinTabel();
        }
        else if(zoomOnScreen === 3) {

           munculinTabel();
           //munculin zoomin class
           zoomin.classList.remove("zoominbefore");
           zoomin.classList.add("zoominafter");
        }
        else if(zoomOnScreen === 4) {

           munculinTabel();
        }
        else if(zoomOnScreen === 0) {

           apusinTabel();
           zoomout.classList.remove("zoomoutafter");
           zoomout.classList.add("zoomoutbefore");
           zoomin.classList.remove("zoominafter");
           zoomin.classList.add("zoominbefore");
        };




    console.log(window.zoomOnScreen);
    });



//fungsi zoom in
  zoomin.addEventListener('click', function(e) {

      window.zoomOnScreen+=1;
      if(zoomOnScreen === 2){

        }
        else if(zoomOnScreen === 1) {

        }
        else if(zoomOnScreen === 3) {

        }
        else if(zoomOnScreen === 4) {

           //apus zoomin class
           zoomin.classList.remove("zoominafter");
           zoomin.classList.add("zoominbefore");
        };




      munculinTabel();



  console.log(window.zoomOnScreen);
  });
