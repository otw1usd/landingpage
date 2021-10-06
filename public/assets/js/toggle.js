//jshint esversion: 8
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

// Bagian gamtek di project projectindex

document.querySelectorAll(".close-foto-gamtek-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector("#zoom-img").remove();
    document.querySelector(".zoomoutafter").classList.add("zoomoutbefore");
    document.querySelector(".zoomoutafter").classList.remove("zoomoutafter");
    document.querySelector(".zoominafter").classList.add("zoominbefore");
    document.querySelector(".zoominafter").classList.remove("zoominafter");
    document.querySelector(".close-foto-gamtek-button").classList.remove("close-foto-gamtek-button-active");
    document.querySelector(".close-foto-gamtek-button-div").classList.remove("close-foto-gamtek-button-div-active");
  });
});


// Input timestamp dari client-side
function toggleClientSideInputTimestamp() {
  document.querySelector(".client-side-input-timestamp").classList.toggle("client-side-input-timestamp-active");
  document.querySelector(".client-side-input-timestamp").classList.toggle("client-side-input-timestamp-inactive");
}


// Input project zone dari client-side
function toggleClientSideInputProjectZone() {
  document.querySelector(".client-side-input-projectzone").classList.toggle("client-side-input-projectzone-active");
  document.querySelector(".client-side-input-projectzone").classList.toggle("client-side-input-projectzone-inactive");
}

function bukatutup() {
  var okedekalogitu = document.getElementById("anjinglah");
  var x = document.getElementById("bukatutup");
  marzipanoFunction();
  bukatutupmaster(x);
  bukatutupmaster(okedekalogitu);
}


function bukatutupmaster(e) {
  if (e.style.display === "none") {
    e.style.display = "block";
  } else {
    e.style.display = "none";
  }
}


function tutupfieldphoto() {

}

function ambilzoneid(a) {
  document.querySelectorAll(".zoneid-openfieldphotoclient").forEach(zoneid => {
    zoneid.value = a;
  });
}

function ambiltimestamp(a) {
  document.querySelectorAll(".timestamp-openfieldphotoclient").forEach(timestamp => {
    timestamp.value = a;
  });
}

function timestampOnScreen(a) {
  document.querySelectorAll(".timestampOnScreen").forEach(timestamp => {
    timestamp.value = a;
  });
}

function bukatutupfieldphoto(e, f) {

  document.querySelector('.filter-field-photo').classList.toggle("filter-field-photo-active");
  document.querySelector('.filter-field-photo').classList.toggle("filter-field-photo-inactive");

  document.querySelector(".filter-field-photo-heading").innerHTML = "Filter Field Photo Zone" + e;
  ambilzoneid(e);
  ambiltimestamp(f);

}

document.querySelectorAll(".toggle-field-photo-grid").forEach(button => {
  button.addEventListener("click", async () => {
    let zoneid = document.querySelector(".zoneid-openfieldphotoclient").value;
    let projectid = document.querySelector(".getProjectId").value;
    let timestamp = document.querySelector(".timestamp-openfieldphotoclient").value;
    let story = document.querySelector(".story-fieldphotoclient").value;
    console.log('ini story ke ' + story);

    await socket.emit("fieldPhotoData", zoneid, timestamp);

    socket.on("fileNameArray", (fileNameArray, zoneid, timestamp) => {
      document.querySelector('.field-photo-grid-div').innerHTML = `
      <button onclick="" class="btn btn-dark btn-sm">
        <i class="fas fa-filter"></i>Filter
      </button>`;
      fileNameArray.forEach(fileName => {
        document.querySelector('.field-photo-grid-div').innerHTML += '<div class="col-4 field-photo-grid"><img onclick="fieldPhotoFullscreen(this)" style="height: auto; width: 100%;" src="/project/' + projectid + '/fieldphoto/' + zoneid + '/' + story + '/' + timestamp + '/compressedfieldphoto/' + fileName + '" alt="">';
      });
      // fileNameArray.length = 0;
    });

    document.querySelector(".field-photo-grid-bg").addEventListener("click", () => {
      document.querySelector('.field-photo-grid-div').innerHTML = "";
      document.querySelector(".field-photo-grid-super-div").classList.remove("field-photo-grid-super-div-active");
      document.querySelector(".field-photo-grid-div").classList.remove("field-photo-grid-div-active");
      document.querySelector(".field-photo-grid-bg").classList.remove("field-photo-grid-bg-active");
    });

    document.querySelector(".field-photo-grid-super-div").classList.add("field-photo-grid-super-div-active");
    document.querySelector(".field-photo-grid-div").classList.add("field-photo-grid-div-active");
    document.querySelector(".field-photo-grid-bg").classList.add("field-photo-grid-bg-active");

  });
});

//Buka foto jadi fullscreen
function fieldPhotoFullscreen(img) {
  const src = img.src;
  const srcsplitfirst = src.split("/");
  const srcnotcompressed = srcsplitfirst[0] + '//' + srcsplitfirst[1] + '/' + srcsplitfirst[2] + '/' + srcsplitfirst[3] + '/' + srcsplitfirst[4] + '/' + srcsplitfirst[5] + '/' + srcsplitfirst[6] + '/' + srcsplitfirst[7] + '/' + srcsplitfirst[8] + '/' + srcsplitfirst[10];

  document.querySelector(".field-photo-fullscreen-super-div").innerHTML = `
    <div class="field-photo-fullscreen-div">
      <div class="field-photo-fullscreen-content">
        <img src="${srcnotcompressed}" style="width: auto; height: 600px;">
      </div>
      <div class="field-photo-fullscreen-bg">
      </div>
    </div>
  `;

  document.querySelector(".field-photo-fullscreen-bg").addEventListener("click", () => {
    document.querySelector(".field-photo-fullscreen-div").remove();
  });
}


function bukatutupuploadfieldphoto(zoneid, timestamp, story, zoneidrapih) {

  document.querySelector(".add-field-photo").classList.add("add-field-photo-active");
  document.querySelector(".add-field-photo").classList.remove("add-field-photo-inactive");
  document.querySelector(".add-field-photo-bg").classList.add("add-field-photo-bg-active");
  document.getElementById("zoneid-uploadfieldphotoclient").value = zoneid;
  document.getElementById("timestamp-uploadfieldphotoclient").value = timestamp;

  const splitTimestamp = timestamp.split("_");
  const date = new Date(Date.UTC(20 + splitTimestamp[2], Number(splitTimestamp[1]) - 1, splitTimestamp[0], 0, 0, 0));
  const utcOffset = date.getTimezoneOffset();
  date.setMinutes(
    date.getMinutes() + utcOffset
  );

  function getMonthYear(date) {
    const options = {
      month: "long",
      year: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
  }

  document.querySelectorAll(".upload-timestamp-indicator").forEach(indicator => {
    indicator.innerHTML = getMonthYear(date);
  });
  document.querySelectorAll(".upload-zoneid-indicator").forEach(indicator => {
    indicator.innerHTML = zoneidrapih;
  });
  document.querySelectorAll(".upload-story-indicator").forEach(indicator => {
    indicator.innerHTML = story;
  });

  document.querySelector(".cancel-upload-field-photo").addEventListener("click", () => {
    document.querySelector(".add-field-photo").classList.remove("add-field-photo-active");
    document.querySelector(".add-field-photo").classList.add("add-field-photo-inactive");
    document.querySelector(".add-field-photo-bg").classList.remove("add-field-photo-bg-active");
  });


  document.querySelector(".upload-category-gamtek-on-fieldphoto").addEventListener("click", () => {
    document.querySelector(".add-field-photo").classList.remove("add-field-photo-active");
    document.querySelector(".add-field-photo").classList.add("add-field-photo-inactive");
    document.querySelector(".add-field-photo-bg").classList.remove("add-field-photo-bg-active");

    bukatutupuploadgamtek(zoneid, timestamp, story, zoneidrapih);
  });
}

function bukatutupuploadgamtek(zoneid, timestamp, story, zoneidrapih) {

  document.querySelector(".add-gamtek").classList.add("add-gamtek-active");
  document.querySelector(".add-gamtek").classList.remove("add-gamtek-inactive");
  document.querySelector(".add-gamtek-bg").classList.add("add-gamtek-bg-active");
  document.getElementById("zoneid-uploadgamtekclient").value = zoneid;
  document.getElementById("story-uploadgamtekclient").value = story;

  document.querySelectorAll(".upload-zoneid-indicator").forEach(indicator => {
    indicator.innerHTML = zoneidrapih;
  });
  document.querySelectorAll(".upload-story-indicator").forEach(indicator => {
    indicator.innerHTML = story;
  });

  document.querySelector(".cancel-upload-gamtek").addEventListener("click", () => {
    document.querySelector(".add-gamtek").classList.remove("add-gamtek-active");
    document.querySelector(".add-gamtek").classList.add("add-gamtek-inactive");
    document.querySelector(".add-gamtek-bg").classList.remove("add-gamtek-bg-active");
  });

  document.querySelector(".upload-category-fieldphoto-on-gamtek").addEventListener("click", () => {
    document.querySelector(".add-gamtek").classList.remove("add-gamtek-active");
    document.querySelector(".add-gamtek").classList.add("add-gamtek-inactive");
    document.querySelector(".add-gamtek-bg").classList.remove("add-gamtek-bg-active");

    bukatutupuploadfieldphoto(zoneid, timestamp, story, zoneidrapih);
  });
}


//input drone data
function toggleClientSideInputDroneData() {
  document.querySelector(".input-drone-data-div").classList.toggle("input-drone-data-inactive");
  document.querySelector(".input-drone-data-div").classList.toggle("input-drone-data-active");
}

// Toggle tambah username
function addUsername(button) {
  button.parentElement.nextElementSibling.classList.toggle("add-username-form-active");
}

//Toggle View Vertical
let storyIndicator = 1;
let viewVerticalIndicator = 1;
let storyIndicatorMax = 2;
let storyIndicatorMin = 1;

function viewVertical() {
  document.querySelector(".view-vertical-div").classList.toggle("view-vertical-div-active");
  document.querySelector(".current-story").innerHTML = "Lantai " + storyIndicator;

  if (viewVerticalIndicator === 1) {
    document.querySelector(".up-one-story").addEventListener("click", () => {
      storyIndicator = storyIndicator + 1;
      document.querySelector(".current-story").innerHTML = "Lantai " + storyIndicator;
      const element = {
        value: waktuOnScreen
      };
      toggleOverlay(element);
      document.querySelectorAll(".story-fieldphotoclient").forEach(storyFieldPhoto => {
        storyFieldPhoto.value = storyIndicator;
      });
      if (storyIndicator === storyIndicatorMax) {
        document.querySelector(".up-one-story").setAttribute("disabled", "");
        document.querySelector(".down-one-story").removeAttribute("disabled");
      } else {
        document.querySelector(".down-one-story").removeAttribute("disabled");
      }
    });

    document.querySelector(".down-one-story").addEventListener("click", () => {
      storyIndicator = storyIndicator - 1;
      document.querySelector(".current-story").innerHTML = "Lantai " + storyIndicator;
      const element = {
        value: waktuOnScreen
      };
      toggleOverlay(element);
      document.querySelectorAll(".story-fieldphotoclient").forEach(storyFieldPhoto => {
        storyFieldPhoto.value = storyIndicator;
      });
      if (storyIndicator === storyIndicatorMin) {
        document.querySelector(".down-one-story").setAttribute("disabled", "");
        document.querySelector(".up-one-story").removeAttribute("disabled");
      } else {
        document.querySelector(".up-one-story").removeAttribute("disabled");
      }
    });

    viewVerticalIndicator = 0;
  }
}


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
