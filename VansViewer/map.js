/* global google */
const axios = require('axios')
const _ = require('lodash')

function decodePolyline(t) {
  const d = []
  for (
    let n, o, u = 0, l = 0, r = 0, h = 0, i = 0, a = null, c = Math.pow(10, 5);
    u < t.length;

  ) {
    a = null
    h = 0
    i = 0
    do {
      a = t.charCodeAt(u++) - 63
      i |= (31 & a) << h
      h += 5
    } while (a >= 32)
    n = 1 & i ? ~(i >> 1) : i >> 1
    h = i = 0
    do {
      a = t.charCodeAt(u++) - 63
      i |= (31 & a) << h
      h += 5
    } while (a >= 32)
    o = 1 & i ? ~(i >> 1) : i >> 1
    l += n
    r += o
    d.push([l / c, r / c])
  }

  return d.map(tt => ({
    lat: tt[0],
    lng: tt[1],
  }))
}
const api = axios.create({
  baseURL: 'http://3.120.249.73:8080/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let map = null

async function login() {
  const {data} = await api.post('/login', {
    username: 'admin',
    password: 'adminiscooler',
  })
  api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
}

function normalizePosition(coords) {
  return {
    lat: coords.lat || coords.latitude,
    lng: coords.lng || coords.longitude,
  }
}

function createVanMarker(coords, id) {
  return new google.maps.Marker({
    position: normalizePosition(coords),
    icon: 'van.png',
    title: `Van ${id}`,
    map,
  })
}

function createVBSMarker(vbs) {
  return new google.maps.Marker({
    position: normalizePosition(vbs.location),
    icon: 'vbs.png',
    title: vbs.name,
    map,
  })
}

const vanColors = ['red', 'green', 'blue']
function createVanRoute(i, path) {
  return new google.maps.Polyline({
    map,
    path,
    strokeColor: vanColors[i],
    strokeOpacity: 1.0,
    strokeWeight: 2,
  })
}

let vanMarkers = []
let vanRoutes = []
async function loadVans() {
  const {data} = await api.get('/vans')
  const vanPolylines = data
    .map(v => v.nextRoutes)
    .map(n =>
      _.flatten(
        n
          .map(ns => _.get(ns, 'routes.0.overview_polyline.points', ''))
          .map(decodePolyline)
      )
    )
  if (vanMarkers.length === 0) {
    vanMarkers = data.map(v => createVanMarker(v.location, v.vanId))
    vanRoutes = data.map((v, i) => createVanRoute(i, vanPolylines[i]))
    return
  }
  const vanPos = data.map(v => normalizePosition(v.location))
  vanMarkers.forEach((v, i) => v.setPosition(vanPos[i]))
  vanRoutes.forEach((v, i) => v.setPath(vanPolylines[i]))
}

async function update() {
  await loadVans()
  setTimeout(update, 1500)
}

async function getVBS() {
  const {data} = await api.get('/virtualbusstops')
  data.map(createVBSMarker)
}

global.initMap = async () => {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 52.520575,
      lng: 13.40896,
    },
    zoom: 12,
  })
  await login()
  await getVBS()
  update()
}
