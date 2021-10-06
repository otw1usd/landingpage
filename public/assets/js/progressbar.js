//jshint esversion:6

//field photo
const form1 = document.querySelector("#uploadFormFieldPhoto");
const progBarFill1 = document.querySelector(".progress-bar-fieldphoto .progress-bar-fill");
const progBarText1 = document.querySelector(".progress-bar-fieldphoto .progress-bar-text");
const successMsg1 = document.querySelector(".progress-bar-fieldphoto .upload-success-message");

form1.addEventListener("submit", uploadFile1);


function uploadFile1(e) {
  e.preventDefault();

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/tambahfieldphotoclient?_method=PUT");
  xhr.upload.addEventListener("progress", e => {
    const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;

    progBarFill1.style.width = percent.toFixed(0) + "%";
    progBarText1.textContent = percent.toFixed(0) + "%";

    if (percent === 100) {
      successMsg1.innerHTML = `<p>Uploaded successfully!</p>`;
    } else {
      successMsg1.innerHTML = ``;
    }

  });
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.send(new FormData(uploadFormFieldPhoto));


}

//gamtek
const form2 = document.querySelector("#uploadFormGamtek");
const progBarFill2 = document.querySelector(".progress-bar-gamtek .progress-bar-fill");
const progBarText2 = document.querySelector(".progress-bar-gamtek .progress-bar-text");
const successMsg2 = document.querySelector(".progress-bar-gamtek .upload-success-message");

form2.addEventListener("submit", uploadFile2);


function uploadFile2(e) {
  e.preventDefault();

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/uploadgamtekclient?_method=PUT");
  xhr.upload.addEventListener("progress", e => {
    const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;

    progBarFill2.style.width = percent.toFixed(0) + "%";
    progBarText2.textContent = percent.toFixed(0) + "%";

    if (percent === 100) {
      successMsg2.innerHTML = `<p>Uploaded successfully!</p>`;
    } else {
      successMsg2.innerHTML = ``;
    }
  });
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.send(new FormData(uploadFormGamtek));
}

//drone data
const form3 = document.querySelector("#uploadFormDroneData");
const progBarFill3 = document.querySelector(".progress-bar-dronedata .progress-bar-fill");
const progBarText3 = document.querySelector(".progress-bar-dronedata .progress-bar-text");
const successMsg3 = document.querySelector(".progress-bar-dronedata .upload-success-message");

form3.addEventListener("submit", uploadFile3);


function uploadFile3(e) {
  e.preventDefault();

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/tambahdroneimagesclient?_method=PUT");
  xhr.upload.addEventListener("progress", e => {
    const percent = e.lengthComputable ? (e.loaded / e.total) * 100 : 0;

    progBarFill3.style.width = percent.toFixed(0) + "%";
    progBarText3.textContent = percent.toFixed(0) + "%";

    if (percent === 100) {
      successMsg3.innerHTML = `<p>Uploaded successfully!</p>`;
    } else {
      successMsg3.innerHTML = ``;
    }


  });
  // xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.send(new FormData(uploadFormDroneData));
}
