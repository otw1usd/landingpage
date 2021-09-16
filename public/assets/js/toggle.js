//jshint esversion:6

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

for (let x = 0; x < document.querySelectorAll(".toggle-field-photo-button").length; x++) {
  document.querySelectorAll(".toggle-field-photo-button")[x].addEventListener("click", () => {
    document.querySelectorAll(".toggle-field-photo-identifier").forEach(button => {
      button.classList.remove("field-photo-active");
    });
    document.querySelectorAll(".close-field-photo-button").forEach(button => {
      button.classList.add("close-field-photo-button-active");
    });
    var zoneName = document.querySelectorAll(".toggle-field-photo-button")[x].innerHTML;
    var zoneNameTrimmed = zoneName.split(" ").join("");
    for (let y = 0; y < document.querySelectorAll(".toggle-field-photo-identifier").length; y++) {
      if (document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.contains(zoneNameTrimmed)) {
        document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.toggle("field-photo-active");
        // document.querySelectorAll(".field-photo-carousel-div")[y].innerHTML = "";
      }
    }
  });
}

document.querySelectorAll(".close-field-photo-button").forEach(button => {
  button.addEventListener("click", () => {
    for (let y = 0; y < document.querySelectorAll(".toggle-field-photo-identifier").length; y++) {
      document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.remove("field-photo-active");
    }
    document.querySelectorAll(".close-field-photo-button").forEach(button => {
      button.classList.remove("close-field-photo-button-active");
    });
  });
});

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
let addFieldPhotoIndicator = 1;

document.querySelectorAll(".toggle-add-field-photo").forEach(button => {
  button.addEventListener("click", () => {
    button.parentElement.nextElementSibling.classList.toggle("add-field-photo-active");

    if (addFieldPhotoIndicator === 1) {
      button.innerText = "-";
      addFieldPhotoIndicator = 0;
    } else {
      button.innerText = "+";
      addFieldPhotoIndicator = 1;
    }
  });
});


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

function bukatutup(){
  var okedekalogitu = document.getElementById("anjinglah");     
  var x = document.getElementById("bukatutup"); 
    marzipanoFunction();
    bukatutupmaster(x);
    bukatutupmaster(okedekalogitu);
};


function bukatutupmaster(e){
  if (e.style.display === "none") {
      e.style.display = "block";
    } else {
      e.style.display = "none";
    }
};

function bukatutupfieldphoto(e){
  for (i = 1; i < 5; i++) {
    //cari code itung jumlah file biar makin auto
    document.querySelector('.fieldphotooow').innerHTML +='<div class="fieldphotoBox"><img src="/project/'+projectid+'/fieldphoto/'+e+'/'+window.waktuOnScreen+'/1631725519592-612b4b94be98e265640757b4-iphone png.png" width="100"></div>'
  }
}
function bukatutupuploadfieldphoto(e){
  document.querySelector('.formpopupbox').innerHTML+='<form class="sign-up-form add-field-photo" method="POST" enctype="multipart/form-data"><label for="image">Upload Field Photos:</label><div class="add-field-photo-button-div"><input type="file" class="add-field-photo-button" name="image" multiple /><button type="submit" class="btn btn-outline-warning btn-sm">Insert Photos</button></div></form>'
}
