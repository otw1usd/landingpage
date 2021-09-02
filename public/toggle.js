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
    console.log(zoneNameTrimmed);
    for (let y = 0; y < document.querySelectorAll(".toggle-field-photo-identifier").length; y++) {
      if (document.querySelectorAll(".toggle-field-photo-identifier")[y].classList.contains(zoneNameTrimmed)) {
        console.log("berhasil");
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

// Bagian gamtek di project projectindex
