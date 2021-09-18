//jshint esversion:6

//COBA COBA NODE.JS EXPRESS DI FE SIAPA TAU BISA
// const express = require("express");
// const router = express.Router();

const socket = io();

// Bagian comment di project.ejs
let toggleCommentIndicator = 1;

document.querySelectorAll(".toggle-comment-button").forEach(button => {
  button.addEventListener("click", () => {
    button.parentElement.nextElementSibling.classList.toggle("reply-comment-active");

    if (toggleCommentIndicator === 1) {
      button.innerText = "Hide Comment";
      toggleCommentIndicator = 0;
    } else {
      button.innerText = "Show Comment";
      toggleCommentIndicator = 1;
    }
  });
});

// Bagian tampilin carousel field photo di project index

// for (let x = 0; x < document.querySelectorAll(".toggle-field-photo-button").length; x++) {
//   document.querySelectorAll(".toggle-field-photo-button")[x].addEventListener("click", () => {
//     document.querySelectorAll(".toggle-field-photo-identifier").forEach(button => {
//       button.classList.remove("field-photo-active");
//     });
//     document.querySelectorAll(".close-field-photo-button").forEach(button => {
//       button.classList.add("close-field-photo-button-active");
//     });
//     var zoneName = document.querySelectorAll(".toggle-field-photo-button")[x].innerHTML;
//     var zoneNameTrimmed = zoneName.split(" ").join("");
//     for (let y = 0; y < document.querySelectorAll(".toggle-field-photo-identifier").length; y++) {
//       if (document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.contains(zoneNameTrimmed)) {
//         document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.toggle("field-photo-active");
//         // document.querySelectorAll(".field-photo-carousel-div")[y].innerHTML = "";
//       }
//     }
//   });
// }
//
// document.querySelectorAll(".close-field-photo-button").forEach(button => {
//   button.addEventListener("click", () => {
//     for (let y = 0; y < document.querySelectorAll(".toggle-field-photo-identifier").length; y++) {
//       document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.remove("field-photo-active");
//     }
//     document.querySelectorAll(".close-field-photo-button").forEach(button => {
//       button.classList.remove("close-field-photo-button-active");
//     });
//   });
// });

// Bagian toggle field photo tergantung timeline

// for (let i = 0; i < document.querySelectorAll(".time-stamp-button").length; i++) {
//   document.querySelector("#radio-" + i).addEventListener("click", function() {
//     for (let z = 0; z < document.querySelectorAll(".time-stamp-button").length; z++) {
//       document.querySelectorAll(".field-photo-super-div")[z].classList.remove("field-photo-super-div-active");
//     }
//     document.querySelectorAll(".field-photo-super-div")[i].classList.toggle("field-photo-super-div-active");
//   });
// }

// Toggle bagian untuk add field photo sebagai client
// let addFieldPhotoIndicator = 1;
//
// document.querySelectorAll(".toggle-add-field-photo").forEach(button => {
//   button.addEventListener("click", () => {
//     button.parentElement.nextElementSibling.classList.toggle("add-field-photo-active");
//
//     if (addFieldPhotoIndicator === 1) {
//       button.innerText = "-";
//       addFieldPhotoIndicator = 0;
//     } else {
//       button.innerText = "+";
//       addFieldPhotoIndicator = 1;
//     }
//   });
// });


// Bagian gamtek di project projectindex

document.querySelectorAll(".close-foto-gamtek-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector("#zoom-img").remove();
    document.querySelector(".zoomoutafter").classList.add("zoomoutbefore");
    document.querySelector(".zoomoutafter").classList.remove("zoomoutafter");
    document.querySelector(".zoominafter").classList.add("zoominbefore");
    document.querySelector(".zoominafter").classList.remove("zoominafter");
    document.querySelector(".close-foto-gamtek-button").classList.remove("close-foto-gamtek-button-active");
  });
});


// Input timestamp dari client-side

document.querySelector(".toggle-client-side-input-timestamp").addEventListener("click", () => {
  document.querySelector(".client-side-input-timestamp").classList.toggle("client-side-input-timestamp-active");
  document.querySelector(".client-side-input-timestamp").classList.toggle("client-side-input-timestamp-inactive");
})

// Input project zone dari client-side
document.querySelector(".toggle-client-side-input-projectzone").addEventListener("click", () => {
  document.querySelector(".client-side-input-projectzone").classList.toggle("client-side-input-projectzone-active");
  document.querySelector(".client-side-input-projectzone").classList.toggle("client-side-input-projectzone-inactive");
})

function bukatutup() {
  var okedekalogitu = document.getElementById("anjinglah");
  var x = document.getElementById("bukatutup");
  marzipanoFunction();
  bukatutupmaster(x);
  bukatutupmaster(okedekalogitu);
};


function bukatutupmaster(e) {
  if (e.style.display === "none") {
    e.style.display = "block";
  } else {
    e.style.display = "none";
  }
};

let oowIndicator = 0;
// let oowIndicator2 = 0;

function bukatutupfieldphoto(e, f) {
  // document.querySelector('.fieldphotooow').innerHTML += '<div class="fieldphotoBox col-4"><img src="/project/' + projectid + '/fieldphoto/' + e + '/' + window.waktuOnScreen + '/<%= FieldPhotoArrays[i].fieldphoto %>" width="100"></div>';


  document.querySelector('.fieldphotooow').classList.toggle("fieldphotooow-active");
  document.querySelector('.fieldphotooow').classList.toggle("fieldphotooow-inactive");

  document.querySelectorAll(".zoneid-openfieldphotoclient").forEach(zoneid => {
    zoneid.value = e;
  });
  document.querySelectorAll(".timestamp-openfieldphotoclient").forEach(timestamp => {
    timestamp.value = f;
  });



  document.querySelectorAll(".toggle-field-photo-grid").forEach(button => {
    button.addEventListener("click", () => {


      if (oowIndicator === 0) {
        const zoneid = document.querySelector(".zoneid-openfieldphotoclient").value;
        const timestamp = document.querySelector(".timestamp-openfieldphotoclient").value;
        socket.emit("fieldPhotoData", zoneid, timestamp);
        socket.on("fileNameArray", fileNameArray => {
          console.log(fileNameArray);
          fileNameArray.forEach(fileName => {

            document.querySelector('.fieldPhotoBox-grid').innerHTML += `
            <div class="col-4">
              <img style="width: 100px; height: auto;" src="/project/612720d418854b2fa4a56e27/fieldphoto/${zoneid}/${timestamp}/${fileName}" alt="">
            </div>`;
          });
        });
        oowIndicator = 1;
      } else {
        document.querySelector('.fieldPhotoBox-grid').innerHTML = "";
        oowIndicator = 0;
      }

      document.querySelector(".fieldphotoBox").classList.toggle("fieldphotoBox-active");

    });
  });

  console.log('inizoneid buat buka fieldpohot ' + e);
  console.log('ini timestamp buat buka fieldpohot ' + f);



  //Close field photo button (yang kebuka dari pinpoint)
  // document.querySelectorAll(".close-field-photo-button").forEach(button => {
  //   button.classList.add("close-field-photo-button-active");
  //   button.addEventListener("click", () => {
  //     document.querySelectorAll(".fieldphotooow").forEach(fieldphoto => {
  //       fieldphoto.classList.add("fieldphotooow-inactive");
  //     });
  //     button.classList.remove("close-field-photo-button-active");
  //     oowIndicator2 = 1;
  //   });
  // });
  //
  // if (oowIndicator === 1) {
  //   document.querySelectorAll(".fieldphotooow").forEach(fieldphoto => {
  //     fieldphoto.classList.toggle("fieldphotooow-inactive");
  //     if (oowIndicator2 === 0) {
  //       document.querySelectorAll(".close-field-photo-button").forEach(button => {
  //         button.classList.toggle("close-field-photo-button-active");
  //       });
  //       oowIndicator2 = 1;
  //     } else {
  //       oowIndicator2 = 0;
  //     }
  //   });
  // }
  // oowIndicator = 1;
}

function bukatutupuploadfieldphoto(e, f) {

  // let addFieldPhotoIndicator = 1;

  document.querySelector(".add-field-photo").classList.toggle("add-field-photo-active");
  document.querySelector(".add-field-photo").classList.toggle("add-field-photo-inactive");
  document.getElementById("zoneid-uploadfieldphotoclient").value = e;
  document.getElementById("timestamp-uploadfieldphotoclient").value = f;
  console.log('inizonidnyaaaaa ' + e);
  console.log('initimestampnyaaa ' + f);

  // if (addFieldPhotoIndicator === 1) {
  //   e.innerText = "-";
  //   addFieldPhotoIndicator = 0;
  // } else {
  //   e.innerText = "+";
  //   addFieldPhotoIndicator = 1;
  // }
}

//COBA COBA NODE.JS EXPRESS DI FE SIAPA TAU BISA
// module.exports = router;
