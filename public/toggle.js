//jshint esversion:6

// Bagian comment di project.ejs
let i = 1;

document.querySelectorAll(".toggle-comment-button").forEach(button => {
  button.addEventListener("click", () => {
    button.parentElement.nextElementSibling.classList.toggle("reply-comment-active");

    if (i === 1) {
      button.innerText = "Hide Comment";
      i = 0;
    } else {
      button.innerText = "Show Comment";
      i = 1;
    }
  });
});

// Bagian field photo di project index

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

for (let i = 1; i < 7; i++) {
  document.querySelector("#radio-" + i).addEventListener("click", function() {
    for (let z = 1; z < 7; z++) {
      document.querySelector(".yang-ke-" + z).classList.remove("field-photo-super-div-active");
    }
    document.querySelector(".yang-ke-" + i).classList.toggle("field-photo-super-div-active");
  });
}


// Bagian gamtek di project projectindex

document.querySelectorAll(".close-foto-gamtek-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector("#zoom-img").remove();
    document.querySelector(".zoomoutafter").classList.add("zoomoutbefore");
    document.querySelector(".zoomoutafter").classList.remove("zoomoutafter");
    document.querySelector(".zoominafter").classList.add("zoominbefore");
    document.querySelector(".zoominafter").classList.remove("zoominafter");
    document.querySelector(".close-foto-gamtek-button").classList.remove("close-foto-gamtek-button-active");
    console.log("testestes");
  });
});
