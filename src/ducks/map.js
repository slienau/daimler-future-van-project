import api from '../lib/api'
import _ from 'lodash'
import {initialMapSearchResults} from '../lib/config'

export const SET_JOURNEY_START = 'map/SET_JOURNEY_START'
export const SET_JOURNEY_DESTINATION = 'map/SET_JOURNEY_DESTINATION'
export const SET_USER_POSITION = 'map/SET_USER_POSITION'
export const SET_VAN_POSITION = 'map/SET_VAN_POSITION'
export const SET_ROUTES = 'map/SET_ROUTES'
export const ADD_SEARCH_RESULT = 'map/ADD_SEARCH_RESULT'
export const CHANGE_MAP_STATE = 'map/CHANGE_MAP_STATE'
export const SWAP_JOURNEY_START_AND_DESTINATION =
  'map/SWAP_JOURNEY_START_AND_DESTINATION'
export const SET_VISIBLE_COORDINATES = 'map/SET_VISIBLE_COORDINATES'

export const MapState = {
  INIT: 'INIT', // the inital state of the map, where either start nor destination location are set
  SEARCH_ROUTES: 'SEARCH_ROUTES', // the state, when a destination is set, shows the SearchForm and the butto search for a route
  ROUTE_SEARCHED: 'ROUTE_SEARCHED', // when a route has been searched and we get a route from the backend, which we then can order
  ROUTE_ORDERED: 'ROUTE_ORDERED', // the state after ordering the route, where we can cancel the order and track the vans live position (own view?)
  ORDER_CANCELLED: 'ORDER_CANCELLED', // after the order is cancelled (necessary? own view? pop up?)
  EXIT_VAN: 'EXIT_VAN',
}

const initialState = {
  journeyStart: null, // {lat, lng, name, description}
  journeyDestination: null, // {lat, lng, name, description}
  userPosition: null,
  vanPosition: null,
  mapState: MapState.INIT,
  routes: null,
  visibleCoordinates: [],
  edgePadding: {top: 0.2, right: 0.1, left: 0.1, bottom: 0.2},
  searchResults: [
    initialMapSearchResults.TU_BERLIN,
    initialMapSearchResults.BRANDENBURGER_TOR,
    initialMapSearchResults.SIDOS_HOOD,
  ],
}

const map = (state = initialState, action) => {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case SET_JOURNEY_START:
      newState.journeyStart = action.payload
      return newState
    case SET_JOURNEY_DESTINATION:
      newState.journeyDestination = action.payload
      return newState
    case SET_USER_POSITION:
      newState.userPosition = action.payload
      return newState
    case SET_ROUTES:
      newState.routes = action.payload
      return newState
    case SET_VAN_POSITION:
      newState.vanPosition = action.payload
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
    case SWAP_JOURNEY_START_AND_DESTINATION:
      newState.journeyStart = state.journeyDestination
      newState.journeyDestination = state.journeyStart
      return newState
    case SET_VISIBLE_COORDINATES:
      newState.visibleCoordinates = action.payload.visibleCoordinates
      newState.edgePadding = action.payload.edgePadding
      return newState
    default:
      return state
  }
}

export const addSearchResultAction = result => {
  return {
    type: ADD_SEARCH_RESULT,
    payload: {result},
  }
}

export const fetchRoutes = () => {
  return async (dispatch, getState) => {
    const {map} = getState()
    const {data} = await api.post('/routes', {
      start: map.journeyStart.location,
      destination: map.journeyDestination.location,
    })
    dispatch(setRoutes(data))
    dispatch(changeMapState(MapState.ROUTE_SEARCHED))
  }
}

export const changeMapState = payload => {
  return {
    type: CHANGE_MAP_STATE,
    payload: payload,
  }
}

export const clearRoutes = () => {
  return dispatch => {
    dispatch(setRoutes(null))
    dispatch(changeMapState(MapState.SEARCH_ROUTES))
  }
}

export const setJourneyStart = journeyStart => {
  return {
    type: SET_JOURNEY_START,
    payload: journeyStart,
  }
}

export const setJourneyDestination = journeyDestination => {
  return {
    type: SET_JOURNEY_DESTINATION,
    payload: journeyDestination,
  }
}

export const setUserPosition = userPosition => {
  return {
    type: SET_USER_POSITION,
    payload: userPosition,
  }
}

export const swapJourneyStartAndDestination = () => {
  return {
    type: SWAP_JOURNEY_START_AND_DESTINATION,
  }
}

export const setVanPosition = vanPosition => {
  return {
    type: SET_VAN_POSITION,
    payload: vanPosition,
  }
}

export const resetMapState = () => {
  return dispatch => {
    dispatch(changeMapState(MapState.INIT))
    dispatch(setJourneyStart(null))
    dispatch(setJourneyDestination(null))
    dispatch(setRoutes(null))
  }
}

export const setVisibleCoordinates = (
  visibleCoordinates,
  edgePadding = initialState.edgePadding
) => {
  return {
    type: SET_VISIBLE_COORDINATES,
    payload: {
      visibleCoordinates: visibleCoordinates,
      edgePadding: edgePadding,
    },
  }
}

export const setRoutes = payload => {
  return {
    type: SET_ROUTES,
    payload: payload,
  }
}

export default map
