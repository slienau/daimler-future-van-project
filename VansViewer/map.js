/* global google */
global.initMap = () => {
  google.maps.Map(document.getElementById('map'), {
    center: {lat: 52.513395, lng: 13.326464},
    zoom: 14,
  })
}
