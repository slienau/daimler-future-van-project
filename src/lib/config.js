export default {
  apiEndpoint: '3.120.249.73',
  googleApiKey: 'AIzaSyBLjSLCSdnDP2K1muAvuiREJmMdY5ahPgk',
}

export const defaultMapRegion = {
  latitude: 52.509663,
  longitude: 13.376481,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

export const initialMapSearchLocations = [
  {
    id: 0,
    description: 'Alexanderplatz',
    name: 'Alexanderplatz',
    vicinity: 'Berlin',
    geometry: {location: {lat: 52.522042, lng: 13.413032}},
  },
  {
    id: 1,
    description: 'TU Berlin',
    name: 'Technische Universität Berlin',
    vicinity: 'Straße des 17. Juni 135, Berlin',
    geometry: {location: {lat: 52.5125322, lng: 13.3269446}},
  },
  {
    id: 2,
    description: 'Brandenburger Tor',
    name: 'Brandenburger Tor',
    vicinity: 'Germany',
    geometry: {location: {lat: 52.51653599999999, lng: 13.3817032}},
  },
  {
    id: 3,
    description: 'Märkisches Viertel',
    name: 'Märkisches Viertel',
    vicinity: 'SIDOs Hoos',
    geometry: {location: {lat: 52.599759, lng: 13.355755}},
  },
]
