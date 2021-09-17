const projectid = document.getElementById("projectid").getAttribute("value");

const getMapsData = async () => {
  const response = await fetch('/project/'+projectid+'/mapsdata.json');
  return response
};

const jsonMapsData = async () => {
  const response =  await (await getMapsData()).json();
  return response
};

const getZoomInitData = async () => {
  const result = await jsonMapsData();
  const result2 = await result[0][0];
  const result3 = await result2.zoomInit;
  return result3
};

const getLatInitData = async () => {
  const result = await jsonMapsData();
  const result2 = result[0][0].latInit;
  return result2
};

const getLngInitData = async () => {
  const result = await jsonMapsData();
  const result2 = result[0][0].lngInit;
  return result2
};

const getTimestamp = async () => {
  const result = await jsonMapsData();
  const result2 = result[1];
  return result2
};

const getProjectZone = async () => {
  const result = await jsonMapsData();
  const result2 = result[2];
  return result2
};


var map;
var imageMapType;
var waktuOnScreen = 0;

async function initialize() {
  var zoomInitDataNotPromise = await getZoomInitData();
  var latInitDataNotPromise = await getLatInitData();
  var lngInitDataNotPromise = await getLngInitData();
  var timestampDataNotPromise = await getTimestamp();
  var timestampDataLength = await timestampDataNotPromise.length;
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

      return ['/project/'+projectid+'/drone/'+timestampDataNotPromise[timestampDataLength-1]+'/',
          zoom, '/', coord.y, '/', coord.x, '.png'
        ]
        .join('');

    },
    tileSize: new google.maps.Size(256, 256)
  });

  map.overlayMapTypes.push(imageMapType);
}


async function toggleOverlay(element) {

  if (element.value == "none") {
    map.overlayMapTypes.clear();
    return;
  }

  var path = "/project/"+projectid+"/drone/" + element.value + "/";
  window.waktuOnScreen = element.value; //yang butuh push

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

  //nanti ini dibuat json
  //content.forEach()

  var projectzoneDataNotPromise = await getProjectZone();
  var projectzoneDataLength = projectzoneDataNotPromise.length;


  for (let i = 0; i < projectzoneDataLength; i++) {
    const projectzoneDataEach = projectzoneDataNotPromise[i];
    const content =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h1 id="firstHeading" class="firstHeading">'+projectzoneDataEach.detailzona+'</h1>' +

        '<div id="bodyContent">' +

        '<table style="width:100%">' +
        "<tr>" +
        "<th> <b> Progres </b></th>" +
        "<th>:</th>" +
        "<th>"+projectzoneDataEach.projectZoneProgres+"</th>" +
        "</tr>" +
        "</table>" +

        '<h6></h6>' +

        '<table style="width:100%">' +
        "<tr>" +
        // "<th> <button>Gantt Chart</button></th>"+
        "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>" +
        "</tr>" +

        "<tr>" +
        "<th><button onclick='bukatutupfieldphoto(\""+projectzoneDataEach.zoneid+"\", \""+waktuOnScreen+"\")'>Field Photo</button><button onclick='bukatutupuploadfieldphoto(\""+projectzoneDataEach.zoneid+"\", \""+waktuOnScreen+"\")'>+</button></th>" + "</tr>" +

        "<tr>" +
        "<th><button>Video</button></th>"+
        "</tr>"+

        "<tr>" +
        "<th><button onclick='gamtekSaya(\""+projectzoneDataEach.zoneid+"\")'>Construction Drawing</button></th>" +
        "</tr>" +

        "<tr>" +
        "<th><button onclick='reportSaya(\""+projectzoneDataEach.zoneid+"\")'>Progress Report</button></th>" +
        "</tr>" +``

        "</table>" +

        "</div>" +
        "</div>";


    const marker = new google.maps.Marker({
      position: {
        lat: parseFloat(projectzoneDataEach.zoneLat),
        lng: parseFloat(projectzoneDataEach.zoneLng)
      },
      map: map,
      title: projectzoneDataEach.zonename,
      icon: {
        url: "/images/hotspot.png",
        scaledSize: new google.maps.Size(25,33)
      },

      animation: google.maps.Animation.DROP
    });

    const infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 200,
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });

    for (let x = 0; x < document.querySelectorAll(".time-stamp-button").length; x++) {
      document.querySelector("#radio-" + x).addEventListener("click", function() {
        infowindow.close();
      });
    }

  };
}

google.maps.event.addDomListener(window, 'load', initialize);
