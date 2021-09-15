// Video Player
const video = document.getElementById('video');
const circlePlayButton = document.getElementById('circle-play-b');

function togglePlay() {
  if (video.paused || video.ended) {
    video.play();

    if (!video.hasAttribute('controls')) {
      video.setAttribute('controls', 'controls');
    }
  } else {
    video.pause();
    video.removeAttribute('controls');
  }
}

circlePlayButton.addEventListener('click', togglePlay);
video.addEventListener('playing', function () {
  circlePlayButton.style.opacity = 0;
});
video.addEventListener('pause', function () {
  circlePlayButton.style.opacity = 1;
  video.removeAttribute('controls');
});

// Google Map

function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(6.3088854, 106.7856958),
    zoom: 5,
    mapTypeId: 'terrain',
  };
  var map = new google.maps.Map(document.getElementById('googleMap'), mapProp);
}
