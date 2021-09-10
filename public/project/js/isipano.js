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

  //toggle to open and close 360 view