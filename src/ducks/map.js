import api from '../lib/api'
import _ from 'lodash'

export const SET_START = 'map/SET_START'
export const SET_DESTINATION = 'map/SET_DESTINATION'
export const SET_LOCATION = 'map/SET_LOCATION'
export const SET_ROUTES = 'map/SET_ROUTES'
export const SET_VAN_LOCATION = 'map/SET_VAN_LOCATION'
export const ADD_SEARCH_RESULT = 'map/ADD_SEARCH_RESULT'
export const CHANGE_MAP_STATE = 'map/CHANGE_MAP_STATE'

export const MapState = {
  INIT: 'INIT', // the inital state of the map, where either start nor destination location are set
  SEARCH_ROUTES: 'SEARCH_ROUTES', // the state, when a destination is set, shows the SearchForm and the butto search for a route
  ROUTE_SEARCHED: 'ROUTE_SEARCHED', // when a route has been searched and we get a route from the backend, which we then can order
  ROUTE_ORDERED: 'ROUTE_ORDERED', // the state after ordering the route, where we can cancel the order and track the vans live position (own view?)
  ORDER_CANCELLED: 'ORDER_CANCELLED', // after the order is cancelled (necessary? own view? pop up?)
}

const TU_BERLIN = {
  id: 1,
  description: 'TU Berlin',
  name: 'Technische Universität Berlin',
  vicinity: 'Straße des 17. Juni 135, Berlin',
  geometry: {location: {lat: 52.5125322, lng: 13.3269446}},
}

const BRANDENBURGER_TOR = {
  id: 2,
  description: 'Brandenburger Tor',
  name: 'Brandenburger Tor',
  vicinity: 'Germany',
  geometry: {location: {lat: 52.51653599999999, lng: 13.3817032}},
}

const SIDOS_HOOD = {
  id: 3,
  description: 'Märkisches Viertel',
  name: 'Märkisches Viertel',
  vicinity: 'SIDOs Hoos',
  geometry: {location: {lat: 52.599759, lng: 13.355755}},
}

const initialState = {
  start: null, // {lat, lng, name, description}
  destination: null, // {lat, lng, name, description}
  location: null,
  mapState: MapState.INIT,
  routes: null,
  vanLocation: null,
  searchResults: [TU_BERLIN, BRANDENBURGER_TOR, SIDOS_HOOD],
}

const map = (state = initialState, action) => {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case SET_START:
      newState.start = action.payload.start
      return newState
    case SET_DESTINATION:
    case SET_LOCATION:
      newState.location = action.payload.location
      return newState
    case SET_ROUTES:
      newState.routes = action.payload
      return newState
    case SET_VAN_LOCATION:
      newState.vanLocation = action.payload.vanLocation
      return newState
    case ADD_SEARCH_RESULT:
      // set latitude and longitude attribute of the location as we use it regularly
      action.payload.result.geometry.location.latitude =
        action.payload.result.geometry.location.lat
      action.payload.result.geometry.location.longitude =
        action.payload.result.geometry.location.lng
      newState.searchResults = state.searchResults.concat(action.payload.result)
      return newState
    case CHANGE_MAP_STATE:
      newState.mapState = action.payload
      return newState
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

export const fetchRoutes = payload => {
  return async dispatch => {
    const {data} = await api.post('/routes', payload)
    dispatch(setRoutes(data))
  }
}

export const changeMapState = payload => {
  return {
    type: CHANGE_MAP_STATE,
    payload: payload,
  }
}

const setRoutes = payload => {
  return {
    type: SET_ROUTES,
    payload: payload,
  }
}

export default map
