export const SET_START = 'map/SET_START'
export const SET_DESTINATION = 'map/SET_DESTINATION'
export const SET_LOCATION = 'map/SET_LOCATION'
export const SET_ROUTE = 'map/SET_ROUTE'
export const SET_VAN_LOCATION = 'map/SET_VAN_LOCATION'
export const SET_ORDER = 'map/SET_ORDER'
export const ADD_SEARCH_RESULT = 'map/ADD_SEARCH_RESULT'

const TU_BERLIN = {
  description: 'TU Berlin',
  name: 'Technische Universität Berlin',
  vicinity: 'Straße des 17. Juni 135, Berlin',
  geometry: {location: {lat: 52.5125322, lng: 13.3269446}},
}

const BRANDENBURGER_TOR = {
  description: 'Brandenburger Tor',
  name: 'Brandenburger Tor',
  vicinity: 'Germany',
  geometry: {location: {lat: 52.51653599999999, lng: 13.3817032}},
}

const initialState = {
  start: null, // {lat, lng, name, description}
  destination: null, // {lat, lng, name, description}
  location: null,
  route: null,
  vanLocation: null,
  order: null,
  searchResults: [TU_BERLIN, BRANDENBURGER_TOR],
}

const map = (state = initialState, action) => {
  switch (action.type) {
    case SET_START:
      return {
        ...state,
        start: action.payload.start,
        // or: location: {...action.payload.location} ??
      }
    case SET_DESTINATION:
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload.location,
        // or: location: {...action.payload.location} ??
      }
    case SET_ROUTE:
    case SET_VAN_LOCATION:
      return {
        ...state,
        vanLocation: action.payload.vanLocation,
      }
    case SET_ORDER:
    case ADD_SEARCH_RESULT:
      // set latitude and longitude attribute of the location as we use it regularly
      action.payload.result.geometry.location.latitude =
        action.payload.result.geometry.location.lat
      action.payload.result.geometry.location.longitude =
        action.payload.result.geometry.location.lng
      return {
        ...state,
        searchResults: state.searchResults.concat(action.payload.result),
      }
    default:
      return state
  }
}

export const setStartAction = (latitude, longitude, name) => {
  return {
    type: SET_START,
    payload: {start: {latitude: latitude, longitude: longitude, name: name}},
  }
}

export const addSearchResultAction = result => {
  return {
    type: ADD_SEARCH_RESULT,
    payload: {result},
  }
}

export default map
