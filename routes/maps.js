const Project = require('../model/project');

var map;
var imageMapType;
var waktuOnScreen=0;

const daftartesproject = Project.find({
    username: 'kcic'
  });
console.log('tes impor ke mpas.js  '+ daftartesproject);


            function initialize() {
                var options = {
                    zoom: 15,
                    center: new google.maps.LatLng(-6.960370735383669, 107.74107971756642),
                    mapTypeId: google.maps.MapTypeId.STREET,
                };

                map = new google.maps.Map(document.getElementById("map"), options);

                var bounds = {
                    13: [[6545, 6545], [4254, 4254]],
                    14: [[13090, 13091], [8509, 8509]],
                    15: [[26180, 26182], [17018, 17019]],
                    16: [[52360, 52365], [34037, 34039]],
                    17: [[104721, 104731], [68075, 68079]],
                    18: [[209443, 209462], [136150, 136158]],
                    19: [[418887, 418924], [272300, 272316]],
                    20: [[837774, 837849], [544600, 544633]],
                    21: [[1675549, 1675699], [1089200, 1089266]],
                    22: [[3351098, 3351399], [2178400, 2178532]]
                };

                 imageMapType = new google.maps.ImageMapType({
                    getTileUrl: function(coord, zoom) {
                        /*if (zoom < 13 || zoom > 25 ||
                            bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
                            bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
                            return null;
                        }*/

                        return ['/project/dataset/drone/01_06_21/',
                zoom , '/' , coord.y , '/' , coord.x , '.png']
                     .join('');

                    },
                    tileSize: new google.maps.Size(256, 256)
                });
                console.log('tes impor ke mpas.js 2 '+ daftartesproject);

                map.overlayMapTypes.push(imageMapType);
            }


        function toggleOverlay(element) {

            if (element.value == "none") {
                map.overlayMapTypes.clear();
                return;
            }

           var path = "/project/dataset/drone/" + element.value + "/";
           window.waktuOnScreen = element.value; //yang butuh push


            imageMapType = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                        /*if (zoom < 13 || zoom > 25 ||
                            bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
                            bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
                            return null;
                        }*/

                        return [path,
                    zoom + "/" + coord.y + "/" + coord.x + ".png"]
                     .join("");

                     

                },
                    tileSize: new google.maps.Size(256, 256)
            });

             map.overlayMapTypes.clear();
               map.overlayMapTypes.push(imageMapType);
               marzipanoFunction();

//nanti ini dibuat json

//content.forEach()


                const content4 =
                    '<div id="content">' +
                    '<div id="siteNotice">' +
                    "</div>" +
                    '<h1 id="firstHeading" class="firstHeading">KM-300</h1>' +


                    '<div id="bodyContent">' +

                    '<table style="width:100%">'+
                    "<tr>" +
                    "<th> <b> Progres </b></th>"+
                    "<th>:</th>"+
                    "<th>100%</th>"+
                    "</tr>"+
                    "</table>"+

                    '<h6></h6>'+

                    '<table style="width:100%">'+
                    "<tr>" +
                    // "<th> <button>Gantt Chart</button></th>"+
                    "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button>Field Photo</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button onclick='gamtekSaya(300)'>Construction Drawing</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button onclick='reportSaya(300)'>Progress Report</button></th>"+
                    "</tr>"+

                    "</table>"+


                    "</div>" +
                    "</div>";

                const content5 =
                    '<div id="content">' +
                    '<div id="siteNotice">' +
                    "</div>" +
                    '<h1 id="firstHeading" class="firstHeading">KM-299</h1>' +


                    '<div id="bodyContent">' +

                    '<table style="width:100%">'+
                    "<tr>" +
                    "<th> <b> Progres </b></th>"+
                    "<th>:</th>"+
                    "<th>100%</th>"+
                    "</tr>"+
                    "</table>"+

                    '<h6></h6>'+

                    '<table style="width:100%">'+
                    "<tr>" +
                    // "<th> <button>Gantt Chart</button></th>"+
                    "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button>Field Photo</button></th>"+
                    "</tr>"+

                    // "<tr>" +
                    // "<th><button>%Cost</button></th>"+
                    // "<th><button>Video</button></th>"+
                    // "</tr>"+

                    "<tr>" +
                    "<th><button onclick='gamtekSaya(299)'>Construction Drawing</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button onclick='reportSaya(299)'>Progress Report</button></th>"+
                    "</tr>"+

                    "</table>"+


                    "</div>" +
                    "</div>";

                    const content6 =
                    '<div id="content">' +
                    '<div id="siteNotice">' +
                    "</div>" +
                    '<h1 id="firstHeading" class="firstHeading">KM-301</h1>' +


                    '<div id="bodyContent">' +

                    '<table style="width:100%">'+
                    "<tr>" +
                    "<th> <b> Progres </b></th>"+
                    "<th>:</th>"+
                    "<th>100%</th>"+
                    "</tr>"+
                    "</table>"+

                    '<h6></h6>'+

                    '<table style="width:100%">'+
                    "<tr>" +
                    // "<th> <button>Gantt Chart</button></th>"+
                    "<th><button onclick='bukatutup()'>3D Virtual Tour</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button>Field Photo</button></th>"+
                    "</tr>"+

                    // "<tr>" +
                    // "<th><button>%Cost</button></th>"+
                    // "<th><button>Video</button></th>"+
                    // "</tr>"+

                    "<tr>" +
                    "<th><button onclick='gamtekSaya(301)'>Construction Drawing</button></th>"+
                    "</tr>"+

                    "<tr>" +
                    "<th><button onclick='reportSaya(301)'>Progress Report</button></th>"+
                    "</tr>"+

                    "</table>"+


                    "</div>" +
                    "</div>";



                const titikKCIC=[


                    [
                        "KM-300",
                        -6.958979247996991, 107.73666835334447,
                        "/img/hotspot.png",
                        25,
                        33,
                        content4,
                    ],

                    [
                        "KM-299",
                        -6.9576846316832635, 107.73280808839294,
                        "/img/hotspot.png",
                        25,
                        33,
                        content5,
                    ],


                    [
                        "KM-301",
                        -6.960370735383669, 107.74107971756642,
                        "/img/hotspot.png",
                        25,
                        33,
                        content6,
                    ],

                ];



                for(let i=0; i<titikKCIC.length;i++){
                    const currtitikKCIC=titikKCIC[i];

                        const marker = new google.maps.Marker({
                        position:{lat:currtitikKCIC[1], lng: currtitikKCIC[2]},
                        map : map,
                        title:currtitikKCIC[0],
                        icon:{
                            url:currtitikKCIC[3],
                            scaledSize:new google.maps.Size(currtitikKCIC[4],currtitikKCIC[5])
                        },

                        animation:google.maps.Animation.DROP
                    });



                    const infowindow = new google.maps.InfoWindow({
                        content: currtitikKCIC[6],
                        maxWidth : 200,
                    });

                    marker.addListener("click", () => {
                        infowindow.open({
                            anchor: marker,
                            map,
                            shouldFocus: false,
                        });
                    });
                };
        }

google.maps.event.addDomListener(window, 'load', initialize);