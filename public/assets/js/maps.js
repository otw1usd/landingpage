//jshint esversion: 8

const projectid = document.getElementById("projectid").getAttribute("value");
const rolemaps = document.querySelector('.getRole').value.split(",");

const getMapsData = async () => {
  const response = await fetch('/project/' + projectid + '/mapsdata.json');
  return response;
};

const jsonMapsData = async () => {
  const response = await (await getMapsData()).json();
  return response;
};

const getZoomInitData = async () => {
  const result = await jsonMapsData();
  const result2 = await result[0][0];
  const result3 = await result2.zoomInit;
  return result3;
};

const getLatInitData = async () => {
  const result = await jsonMapsData();
  const result2 = result[0][0].latInit;
  return result2;
};

const getLngInitData = async () => {
  const result = await jsonMapsData();
  const result2 = result[0][0].lngInit;
  return result2;
};

const getTimestamp = async () => {
  const result = await jsonMapsData();
  const result2 = result[1];
  return result2;
};

const getProjectZone = async () => {
  const result = await jsonMapsData();
  const result2 = result[2];
  return result2;
};


var map;
var imageMapType;
var waktuOnScreen = 0;

async function getNumericValue(date) {
  const dateDate = await new Date(date);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  };
  const dateDatedate = await dateDate.toLocaleDateString("in-ID", options);
  return dateDatedate.split("/").join("_");
}

async function initialize() {
  var zoomInitDataNotPromise = await getZoomInitData();
  var latInitDataNotPromise = await getLatInitData();
  var lngInitDataNotPromise = await getLngInitData();
  var timestampDataNotPromise = await getTimestamp();
  var timestampDataLength = await timestampDataNotPromise.length;
  if (timestampDataLength === 0) {
    var dateInitialObject = undefined
  } else {
    var dateInitialObject = {
      value: await getNumericValue(timestampDataNotPromise[timestampDataLength - 1].timestampproject)
    };
  }

  var options = {
    zoom: zoomInitDataNotPromise,
    center: new google.maps.LatLng(latInitDataNotPromise, lngInitDataNotPromise),
    mapTypeId: google.maps.MapTypeId.STREET,
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  imageMapType = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      /*if (zoom < 13 || zoom > 25 ||
          bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
          bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
          return null;
      }*/

      return ['/project/' + projectid + '/drone/' + dateInitialObject.value + '/',
          zoom, '/', coord.y, '/', coord.x, '.png'
        ]
        .join('');

    },
    tileSize: new google.maps.Size(256, 256)
  });

  await toggleOverlay(dateInitialObject);

  var vMarker = new google.maps.Marker({
    position: new google.maps.LatLng(latInitDataNotPromise, lngInitDataNotPromise),
    draggable: true
  });
  // adds a listener to the marker
  // gets the coords when drag event ends
  // then updates the input with the new coords
  google.maps.event.addListener(vMarker, 'dragend', function(evt) {
    $("#zoneLat").val(evt.latLng.lat().toFixed(6));
    $("#zoneLng").val(evt.latLng.lng().toFixed(6));
    map.panTo(evt.latLng);
  });
  // centers the map on markers coords
  map.setCenter(vMarker.position);
  // adds the marker on the map
  vMarker.setMap(map);

  map.overlayMapTypes.push(imageMapType);
}

let markers = [];

async function toggleOverlay(element) {
  function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
    markers = [];
  }
  // Removes the markers from the map, but keeps them in the array.
  setMapOnAll(null);

  if (element.value == "none") {
    map.overlayMapTypes.clear();
    return;
  }

  var path = "/project/" + projectid + "/drone/" + element.value + "/";
  window.waktuOnScreen = element.value;
  document.querySelector(".getTimestamp").value = element.value;
  tutupfieldphoto();
  timestampOnScreen(element.value);

  imageMapType = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      /*if (zoom < 13 || zoom > 25 ||
          bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
          bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
          return null;
      }*/

      return [path,
          zoom + "/" + coord.y + "/" + coord.x + ".png"
        ]
        .join("");

    },
    tileSize: new google.maps.Size(256, 256)
  });

  map.overlayMapTypes.clear();
  map.overlayMapTypes.push(imageMapType);

  var projectzoneDataNotPromise = await getProjectZone();
  var projectzoneDataLength = projectzoneDataNotPromise.length;

  for (let i = 0; i < projectzoneDataLength; i++) {
    const projectzoneDataEach = projectzoneDataNotPromise[i];
    const contentconsultant =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h2 id="firstHeading" class="firstHeading">' + projectzoneDataEach.detailzona + '</h1>' +
      '<h1 id="firstHeading" class="firstHeading">Lantai ' + storyIndicator + '</h1>' +

      '<div id="bodyContent">' +

      '<table style="width:100%">' +
      "<tr>" +
      "<th> <b> Progres </b></th>" +
      "<th>:</th>" +
      "<th>" + projectzoneDataEach.projectZoneProgres + "</th>" +
      "</tr>" +
      "</table>" +

      '<h6></h6>' +

      '<table style="width:100%">' +
      "<tr>" +
      // "<th> <button>Gantt Chart</button></th>"+
      // "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>" +
      "</tr>" +

      "<tr>" +
      "<th><button onclick='bukatutupfieldphoto(\"" + projectzoneDataEach.zoneid + "\", \"" + waktuOnScreen + "\")'>Field Photo</button><button onclick='bukatutupuploadfieldphoto(\"" + projectzoneDataEach.zoneid + "\", \"" + waktuOnScreen + "\",\"" + storyIndicator + "\",\"" + projectzoneDataEach.detailzona + "\")'>+</button></th>" + "</tr>" +

      "<tr>" +
      // "<th><button>Video</button></th>"+
      "</tr>" +

      "<tr>" +

      "<th><button onclick='gamtekSaya(\"" + projectzoneDataEach.zoneid + "\", \"" + storyIndicator + "\")'>Construction Drawing</button><button onclick='bukatutupuploadgamtek(\"" + projectzoneDataEach.zoneid + "\",  \"" + waktuOnScreen + "\",\"" + storyIndicator + "\",\"" + projectzoneDataEach.detailzona + "\")'>+</button></th>" +

      "</tr>" +

      "<tr>" +
      // "<th><button onclick='reportSaya(\""+projectzoneDataEach.zoneid+"\")'>Progress Report</button></th>" +
      "</tr>" + ``;

    "</table>" +

    "</div>" +
    "</div>";

    const contentlainnya =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h2 id="firstHeading" class="firstHeading">' + projectzoneDataEach.detailzona + '</h1>' +
      '<h1 id="firstHeading" class="firstHeading">Lantai ' + storyIndicator + '</h1>' +

      '<div id="bodyContent">' +

      '<table style="width:100%">' +
      "<tr>" +
      "<th> <b> Progres </b></th>" +
      "<th>:</th>" +
      "<th>" + projectzoneDataEach.projectZoneProgres + "</th>" +
      "</tr>" +
      "</table>" +

      '<h6></h6>' +

      '<table style="width:100%">' +
      "<tr>" +
      // "<th> <button>Gantt Chart</button></th>"+
      // "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>" +
      "</tr>" +

      "<tr>" +
      "<th><button onclick='bukatutupfieldphoto(\"" + projectzoneDataEach.zoneid + "\", \"" + waktuOnScreen + "\")'>Field Photo</button><button onclick='bukatutupuploadfieldphoto(\"" + projectzoneDataEach.zoneid + "\", \"" + waktuOnScreen + "\",\"" + storyIndicator + "\",\"" + projectzoneDataEach.detailzona + "\")'>+</button></th>" + "</tr>" +

      "<tr>" +
      // "<th><button>Video</button></th>"+
      "</tr>" +

      "<tr>" +

      "<th><button onclick='gamtekSaya(\"" + projectzoneDataEach.zoneid + "\", \"" + storyIndicator + "\")'>Construction Drawing</button></th>" +

      "</tr>" +

      "<tr>" +
      // "<th><button onclick='reportSaya(\""+projectzoneDataEach.zoneid+"\")'>Progress Report</button></th>" +
      "</tr>" + ``;

    "</table>" +

    "</div>" +
    "</div>";

    const contentmember =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h2 id="firstHeading" class="firstHeading">' + projectzoneDataEach.detailzona + '</h1>' +
      '<h1 id="firstHeading" class="firstHeading">Lantai ' + storyIndicator + '</h1>' +

      '<div id="bodyContent">' +

      '<table style="width:100%">' +
      "<tr>" +
      "<th> <b> Progres </b></th>" +
      "<th>:</th>" +
      "<th>" + projectzoneDataEach.projectZoneProgres + "</th>" +
      "</tr>" +
      "</table>" +

      '<h6></h6>' +

      '<table style="width:100%">' +
      "<tr>" +
      // "<th> <button>Gantt Chart</button></th>"+
      // "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>" +
      "</tr>" +

      "<tr>" +
      "<th><button onclick='bukatutupfieldphoto(\"" + projectzoneDataEach.zoneid + "\", \"" + waktuOnScreen + "\")'>Field Photo</button><button onclick='bukatutupuploadfieldphoto(\"" + projectzoneDataEach.zoneid + "\", \"" + waktuOnScreen + "\",\"" + storyIndicator + "\",\"" + projectzoneDataEach.detailzona + "\")'>+</button></th>" + "</tr>" +

      "<tr>" +
      // "<th><button>Video</button></th>"+
      "</tr>" +

      "<tr>" +

      "</tr>" +

      "<tr>" +
      // "<th><button onclick='reportSaya(\""+projectzoneDataEach.zoneid+"\")'>Progress Report</button></th>" +
      "</tr>" + ``;

    "</table>" +

    "</div>" +
    "</div>";

    let angkacontent = [];
    await rolemaps.forEach(role => {
      //owner
      if (role === 'Owner') {
        angkacontent.push(2);
      }

      //consultant
      if (role === 'Consultant') {
        angkacontent.push(3);
      }

      //contractor
      if (role === 'Contractor') {
        angkacontent.push(2);
      }

      //droneengineer
      if (role === 'Drone Engineer') {
        angkacontent.push(2);
      }

      //member
      if (role === 'Member') {
        angkacontent.push(1);

      }
    });
    var angkacontentmax = await Math.max(...angkacontent);

    var content;
    if (angkacontentmax == 3) {
      content = contentconsultant;
    } else if (angkacontentmax == 2) {
      content = contentlainnya;
    } else {
      content = contentmember;
    }

    if (projectzoneDataEach.storyMax >= storyIndicator && projectzoneDataEach.storyMin <= storyIndicator) {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(projectzoneDataEach.zoneLat),
          lng: parseFloat(projectzoneDataEach.zoneLng)
        },
        map: map,
        title: projectzoneDataEach.zonename,
        icon: {
          url: "/images/hotspot.png",
          scaledSize: new google.maps.Size(25, 33)
        },

        animation: google.maps.Animation.DROP
      });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });

      markers.push(marker);
    }

    const infowindow = new google.maps.InfoWindow({
      content: content,

      maxWidth: 200,
    });



    for (let x = 0; x < document.querySelectorAll(".time-stamp-button").length; x++) {
      document.querySelector("#radio-" + x).addEventListener("click", function() {
        infowindow.close();
      });
    }

    document.querySelector(".up-one-story").addEventListener("click", function() {
      infowindow.close();
    });
    document.querySelector(".down-one-story").addEventListener("click", function() {
      infowindow.close();
    });

  }
}

google.maps.event.addDomListener(window, 'load', initialize);
