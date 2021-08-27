//jshint esversion:6

// Bagian comment di project.ejs
var i = 1;

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

document.querySelectorAll(".toggle-field-photo-button").forEach(button => {
  button.addEventListener("click", () => {
    button.nextElementSibling.classList.toggle("field-photo-active");
  });
});
