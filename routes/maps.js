const { Loader } = require('@googlemaps/js-api-loader');

const loader = new Loader({
  apiKey: "AIzaSyBbUFZJhvcv_dLJIxGJrdfpTE3YLhupiVA",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4
};

// // Promise
// loader
//   .load()
//   .then((google) => {
//     new google.maps.Map(document.getElementById("map"), mapOptions);
//   })
//   .catch(e => {
//     // do something
//   });

  // Callback
loader.loadCallback(e => {
  if (e) {
    console.log(e);
  } else {
    new google.maps.Map(document.getElementById("map"), mapOptions);
  }
});

console.log('google maps mantap');











// const {Client} = require("@googlemaps/google-maps-services-js");

// const client = new Client({});

// client
//   .elevation({
//     params: {
//       locations: [{ lat: 45, lng: -110 }],
//       key: "AIzaSyBbUFZJhvcv_dLJIxGJrdfpTE3YLhupiVA",
//     },
//     timeout: 1000, // milliseconds
//   })
//   .then((r) => {
//     console.log(r.data.results[0].elevation);
//   })
//   .catch((e) => {
//     console.log(e.response.data.error_message);
//   });

//   console.log('cekcek: '+client.elevation.body);

  // export default {
  //   data() {
  //     return {
  //       map: null,
  //     };
  //   },
  //   async mounted() {
  //     const maps = await this.$loadGoogleMapsApi();
  
  //     this.map = new maps.Map(this.$refs.map, {
  //       center: { lat: 40, lng: -100 },
  //       zoom: 4,
  //     });
  //   },
  // };