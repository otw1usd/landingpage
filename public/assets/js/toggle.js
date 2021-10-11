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

//Olah date yang snake casing jadi month year
function getMonthYear(timestamp) {
  const splitTimestamp = timestamp.split("_");
  const date = new Date(Date.UTC(20 + splitTimestamp[2], Number(splitTimestamp[1]) - 1, splitTimestamp[0], 0, 0, 0));
  const utcOffset = date.getTimezoneOffset();
  date.setMinutes(
    date.getMinutes() + utcOffset
  );
  const options = {
    month: "long",
    year: "numeric"
  };
  return date.toLocaleDateString("en-US", options);
}

function bukatutupfieldphoto(e, f) {

  ambilzoneid(e);
  ambiltimestamp(f);

  let zoneid = document.querySelector(".zoneid-openfieldphotoclient").value;
  let projectid = document.querySelector(".getProjectId").value;
  let timestamp = document.querySelector(".timestamp-openfieldphotoclient").value;
  let story = document.querySelector(".story-fieldphotoclient").value;
  const timestampRapih = getMonthYear(timestamp);

  socket.emit("fieldPhotoData", zoneid, timestamp, story, function(response) {
    const fileNameArray = response.fileNameArray;
    const zoneRapih = response.zoneRapih;

    document.querySelector('.field-photo-grid-div').innerHTML = `
      <div class="fieldphoto-grid-instruction-div">
      <h4> Field Photo </h4>
      <span class="marg-bot-1-rem">${timestampRapih} > Zone ${zoneRapih} > Story ${story}</span>
      <br>
      <span>
      Filter:
        <input type="checkbox" id="show-fieldphoto-filter-str" onclick="showFieldPhotoFiltered(this)" value="STR" checked="checked">
        <span for="show-fieldphoto-filter-str">Struktur</span>
        <input type="checkbox" id="show-fieldphoto-filter-ars" onclick="showFieldPhotoFiltered(this)" value="ARS" checked="checked">
        <span for="show-fieldphoto-filter-ars-filter">Arsitektur</span>
        <input type="checkbox" id="show-fieldphoto-filter-mep" onclick="showFieldPhotoFiltered(this)" value="MEP" checked="checked">
        <span for="show-fieldphoto-filter-mep">MEP</span>
      </span>
      </div>
      `;
    if (fileNameArray.length !== 0) {
      fileNameArray.forEach(fileName => {
        const fieldPhotoCategory = fileName.substring(0, 3);

        if (fieldPhotoCategory === "STR") {
          document.querySelector('.field-photo-grid-div').innerHTML += `
            <div class="col-4 field-photo-grid field-photo-str">
              <img onclick="fieldPhotoFullscreen(this)" style="height: auto; width: 100%;" src="/project/${projectid}/fieldphoto/${zoneid}/${story}/${timestamp}/compressedfieldphoto/${fileName}" alt="">
            </div>
          `;
        }

        if (fieldPhotoCategory === "ARS") {
          document.querySelector('.field-photo-grid-div').innerHTML += `
            <div class="col-4 field-photo-grid field-photo-ars">
              <img onclick="fieldPhotoFullscreen(this)" style="height: auto; width: 100%;" src="/project/${projectid}/fieldphoto/${zoneid}/${story}/${timestamp}/compressedfieldphoto/${fileName}" alt="">
            </div>
          `;
        }

        if (fieldPhotoCategory === "MEP") {
          document.querySelector('.field-photo-grid-div').innerHTML += `
            <div class="col-4 field-photo-grid field-photo-mep">
              <img onclick="fieldPhotoFullscreen(this)" style="height: auto; width: 100%;" src="/project/${projectid}/fieldphoto/${zoneid}/${story}/${timestamp}/compressedfieldphoto/${fileName}" alt="">
            </div>
          `;
        }

      });
    } else {
      document.querySelector('.field-photo-grid-div').innerHTML += `<h4 class="text-center"> No field photo uploaded </h4>`;
    }
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

}

//untuk show gamtek sesuai filter
let showFieldPhotoFilteredIndicatorStr = true;
let showFieldPhotoFilteredIndicatorArs = true;
let showFieldPhotoFilteredIndicatorMep = true;
//
function showFieldPhotoFiltered(category) {

  if (category.value === "STR") {
    if (showFieldPhotoFilteredIndicatorStr === false) {
      document.querySelectorAll(".field-photo-str").forEach(foto => {
        foto.style.display = "inline-block";
      });
      showFieldPhotoFilteredIndicatorStr = true;
    } else {
      document.querySelectorAll(".field-photo-str").forEach(foto => {
        foto.style.display = "none";
      });
      showFieldPhotoFilteredIndicatorStr = false;
    }
  }

  if (category.value === "ARS") {
    if (showFieldPhotoFilteredIndicatorArs === false) {
      document.querySelectorAll(".field-photo-ars").forEach(foto => {
        foto.style.display = "inline-block";
      });
      showFieldPhotoFilteredIndicatorArs = true;
    } else {
      document.querySelectorAll(".field-photo-ars").forEach(foto => {
        foto.style.display = "none";
      });
      showFieldPhotoFilteredIndicatorArs = false;
    }
  }

  if (category.value === "MEP") {
    if (showFieldPhotoFilteredIndicatorMep === false) {
      document.querySelectorAll(".field-photo-mep").forEach(foto => {
        foto.style.display = "inline-block";
      });
      showFieldPhotoFilteredIndicatorMep = true;
    } else {
      document.querySelectorAll(".field-photo-mep").forEach(foto => {
        foto.style.display = "none";
      });
      showFieldPhotoFilteredIndicatorMep = false;
    }
  }
}


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

//Upload fieldphoto

function bukatutupuploadfieldphoto(zoneid, timestamp, story, zoneidrapih) {

  document.querySelector(".add-field-photo").classList.add("add-field-photo-active");
  document.querySelector(".add-field-photo").classList.remove("add-field-photo-inactive");
  document.querySelector(".add-field-photo-bg").classList.add("add-field-photo-bg-active");
  document.getElementById("zoneid-uploadfieldphotoclient").value = zoneid;
  document.getElementById("timestamp-uploadfieldphotoclient").value = timestamp;

  document.querySelectorAll(".upload-timestamp-indicator").forEach(indicator => {
    indicator.innerHTML = getMonthYear(timestamp);
  });
  document.querySelectorAll(".upload-zoneid-indicator").forEach(indicator => {
    indicator.innerHTML = zoneidrapih;
  });
  document.querySelectorAll(".upload-story-indicator").forEach(indicator => {
    indicator.innerHTML = story;
  });

  document.querySelector(".cancel-upload-field-photo").addEventListener("click", () => {
    const progBarFill1 = document.querySelector(".progress-bar-fieldphoto .progress-bar-fill");
    const progBarText1 = document.querySelector(".progress-bar-fieldphoto .progress-bar-text");
    const successMsg1 = document.querySelector(".progress-bar-fieldphoto .upload-success-message");

    document.querySelector(".add-field-photo").classList.remove("add-field-photo-active");
    document.querySelector(".add-field-photo").classList.add("add-field-photo-inactive");
    document.querySelector(".add-field-photo-bg").classList.remove("add-field-photo-bg-active");
    document.querySelector(".add-field-photo-button").value = "";

    progBarFill1.style.width = "0%";
    progBarText1.textContent = "0%";
    successMsg1.innerHTML = ``;
  });


  document.querySelector(".upload-category-gamtek-on-fieldphoto").addEventListener("click", () => {
    document.querySelector(".add-field-photo").classList.remove("add-field-photo-active");
    document.querySelector(".add-field-photo").classList.add("add-field-photo-inactive");
    document.querySelector(".add-field-photo-bg").classList.remove("add-field-photo-bg-active");

    bukatutupuploadgamtek(zoneid, timestamp, story, zoneidrapih);
  });
}

//untuk assign category field photo
function filterFieldPhoto(btn) {
  const category = btn.value;
  document.querySelector("#category-uploadfieldphotoclient").value = category;
}

//Upload gamtek

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
    const progBarFill2 = document.querySelector(".progress-bar-gamtek .progress-bar-fill");
    const progBarText2 = document.querySelector(".progress-bar-gamtek .progress-bar-text");
    const successMsg2 = document.querySelector(".progress-bar-gamtek .upload-success-message");

    document.querySelector(".add-gamtek").classList.remove("add-gamtek-active");
    document.querySelector(".add-gamtek").classList.add("add-gamtek-inactive");
    document.querySelector(".add-gamtek-bg").classList.remove("add-gamtek-bg-active");
    document.querySelector(".add-gamtek-button").value = "";

    progBarFill2.style.width = "0%";
    progBarText2.textContent = "0%";
    successMsg2.innerHTML = ``;
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
  const timestamp = document.querySelector(".getTimestamp").value;
  const timestampRapih = getMonthYear(timestamp);
  document.querySelector(".upload-drone-timestamp").innerHTML = "For " + timestampRapih;

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

function viewVertical() {

  if (viewVerticalIndicator === 1) {
    const projectid = document.querySelector(".getProjectId").value;
    socket.emit("storyMaxMin", projectid, function(response) {

      let storyIndicatorMax = response.max;
      let storyIndicatorMin = response.min;
      // console.log("story max: " + storyIndicatorMax + ", story min: " + storyIndicatorMin);

      if (storyIndicatorMax === storyIndicator) {
        document.querySelector(".up-one-story").setAttribute("disabled", "");
      }
      if (storyIndicatorMin === storyIndicator) {
        document.querySelector(".down-one-story").setAttribute("disabled", "");
      }

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
    });

    viewVerticalIndicator = 0;
  }

  document.querySelector(".view-vertical-div").classList.toggle("view-vertical-div-active");
  document.querySelector(".current-story").innerHTML = "Lantai " + storyIndicator;
}
