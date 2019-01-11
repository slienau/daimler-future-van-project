export default {
  apiEndpoint: '3.120.249.73',
  googleApiKey: 'AIzaSyBLjSLCSdnDP2K1muAvuiREJmMdY5ahPgk',
}

export const initialMapRegion = {
  latitude: 52.509663,
  longitude: 13.376481,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

export const initialMapSearchResults = {
  TU_BERLIN: {
    id: 1,
    description: 'TU Berlin',
    name: 'Technische Universität Berlin',
    vicinity: 'Straße des 17. Juni 135, Berlin',
    geometry: {location: {lat: 52.5125322, lng: 13.3269446}},
  },

  BRANDENBURGER_TOR: {
    id: 2,
    description: 'Brandenburger Tor',
    name: 'Brandenburger Tor',
    vicinity: 'Germany',
    geometry: {location: {lat: 52.51653599999999, lng: 13.3817032}},
  },

  SIDOS_HOOD: {
    id: 3,
    description: 'Märkisches Viertel',
    name: 'Märkisches Viertel',
    vicinity: 'SIDOs Hoos',
    geometry: {location: {lat: 52.599759, lng: 13.355755}},
  },
}
