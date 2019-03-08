import api from '../lib/api'
import _ from 'lodash'
import moment from 'moment'

export const SET_USER_START_LOCATION = 'map/SET_USER_START_LOCATION'
export const SET_USER_DESTINATION_LOCATION = 'map/SET_USER_DESTINATION_LOCATION'
export const SET_CURRENT_USER_LOCATION = 'map/SET_CURRENT_USER_LOCATION'
export const CHANGE_MAP_STATE = 'map/CHANGE_MAP_STATE'
export const SWAP_JOURNEY_START_AND_DESTINATION =
  'map/SWAP_JOURNEY_START_AND_DESTINATION'
export const SET_VISIBLE_COORDINATES = 'map/SET_VISIBLE_COORDINATES'
export const VISIBLE_COORDINATES_UPDATED = 'map/VISIBLE_COORDINATES_UPDATED'
export const SET_VANS = 'map/SET_VANS'
export const SET_PERSON_COUNT = 'map/SET_PERSON_COUNT'
export const FETCH_ROUTES = 'map/FETCH_ROUTES'
export const CLEAR_ROUTES = 'map/CLEAR_ROUTES'
export const RESET_MAP_STATE = 'map/RESET_MAP_STATE'
export const UPDATE_ROUTE_INFO = 'map/UPDATE_ROUTE_INFO'

export const MapState = {
  INIT: 'INIT', // the inital state of the map, where either start nor destination location are set
  SEARCH_ROUTES: 'SEARCH_ROUTES', // the state, when a destination is set, shows the SearchForm and the butto search for a route
  ROUTE_SEARCHED: 'ROUTE_SEARCHED', // when a route has been searched and we get a route from the backend, which we then can order
  ROUTE_ORDERED: 'ROUTE_ORDERED', // the state after ordering the route, where we can cancel the order and track the vans live position (own view?)
  VAN_RIDE: 'VAN_RIDE', // the state during the ride
  EXIT_VAN: 'EXIT_VAN',
}

const initialState = {
  mapState: MapState.INIT,
  userStartLocation: null, // {lat, lng, name, description}
  userDestinationLocation: null, // {lat, lng, name, description}
  currentUserLocation: null,
  routeInfo: {
    id: null,
    vanStartVBS: null,
    vanEndVBS: null,
    toDestinationRoute: null,
    toStartRoute: null,
    vanRoute: null,
    vanDepartureTime: null,
    vanArrivalTime: null,
    validUntil: null,
    vanId: null,
    guaranteedVanArrivalTime: null,
    toDestinationWalkingTime: null,
    userArrivalTime: null,
    guaranteedUserArrivalTime: null,
  },
  visibleCoordinates: [],
  edgePadding: {top: 0.2, right: 0.1, left: 0.1, bottom: 0.2},
  hasVisibleCoordinatesUpdate: false,
  vans: [],
  personCount: 1,
}

const getUpdatedRouteInfoObject = (input, oldState) => {
  const _toDestinationWalkingTime = _.get(
    input,
    'toDestinationWalkingTime',
    oldState.toDestinationWalkingTime
  )

  const _vanArrivalTime = _.get(
    input,
    'vanArrivalTime',
    oldState.vanArrivalTime
  )

  const _guaranteedVanArrivalTime = _.get(
    input,
    'guaranteedVanArrivalTime',
    oldState.guaranteedVanArrivalTime
  )

  return {
    id: _.get(input, 'id', oldState.id),
    vanStartVBS: _.get(input, 'vanStartVBS', oldState.vanStartVBS),
    vanEndVBS: _.get(input, 'vanEndVBS', oldState.vanEndVBS),
    toDestinationRoute: _.get(
      input,
      'toDestinationRoute',
      oldState.toDestinationRoute
    ),
    toStartRoute: _.get(input, 'toStartRoute', oldState.toStartRoute),
    vanRoute: _.get(input, 'vanRoute', oldState.vanRoute),
    vanDepartureTime: _.get(
      input,
      'vanDepartureTime',
      oldState.vanDepartureTime
    ),
    vanArrivalTime: _vanArrivalTime,
    validUntil: _.get(input, 'validUntil', oldState.validUntil),
    vanId: _.get(input, 'vanId', oldState.vanId),
    guaranteedVanArrivalTime: _guaranteedVanArrivalTime,
    toDestinationWalkingTime: _toDestinationWalkingTime,
    userArrivalTime: moment(_vanArrivalTime).add(
      _toDestinationWalkingTime,
      's'
    ),
    guaranteedUserArrivalTime: moment(_guaranteedVanArrivalTime).add(
      _toDestinationWalkingTime,
      's'
    ),
  }
}

const map = (state = initialState, action) => {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case SET_USER_START_LOCATION:
      newState.userStartLocation = action.payload
      return newState
    case SET_USER_DESTINATION_LOCATION:
      newState.userDestinationLocation = action.payload
      return newState
    case SET_CURRENT_USER_LOCATION:
      newState.currentUserLocation = action.payload
      return newState
    case UPDATE_ROUTE_INFO:
      newState.routeInfo = getUpdatedRouteInfoObject(
        action.payload,
        state.routeInfo
      )
      return newState
    case CLEAR_ROUTES:
      newState.routeInfo = initialState.routeInfo
      return newState
    case CHANGE_MAP_STATE:
      newState.mapState = action.payload
      return newState
    case SWAP_JOURNEY_START_AND_DESTINATION:
      newState.userStartLocation = state.userDestinationLocation
      newState.userDestinationLocation = state.userStartLocation
      return newState
    case SET_VISIBLE_COORDINATES:
      newState.visibleCoordinates = action.payload.visibleCoordinates
      newState.edgePadding = action.payload.edgePadding
      newState.hasVisibleCoordinatesUpdate = true
      return newState
    case VISIBLE_COORDINATES_UPDATED:
      newState.hasVisibleCoordinatesUpdate = false
      return newState
    case SET_VANS:
      newState.vans = action.payload
      return newState
    case SET_PERSON_COUNT:
      newState.personCount = action.payload
      return newState
    case RESET_MAP_STATE:
      return initialState
    default:
      return state
  }
}

export const fetchRoutes = () => {
  return async (dispatch, getState) => {
    const {map} = getState()
    const {data} = await api.post('/routes', {
      start: map.userStartLocation.location,
      destination: map.userDestinationLocation.location,
      passengers: map.personCount,
    })
    dispatch({
      type: FETCH_ROUTES,
    })
    dispatch({
      type: UPDATE_ROUTE_INFO,
      payload: data[0],
    })
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
    dispatch({
      type: CLEAR_ROUTES,
    })
    dispatch(changeMapState(MapState.SEARCH_ROUTES))
  }
}

export const setUserStartLocation = userStartLocation => {
  return {
    type: SET_USER_START_LOCATION,
    payload: userStartLocation,
  }
}

export const setUserDestinationLocation = userDestinationLocation => {
  return {
    type: SET_USER_DESTINATION_LOCATION,
    payload: userDestinationLocation,
  }
}

export const setCurrentUserLocation = currentUserLocation => {
  return {
    type: SET_CURRENT_USER_LOCATION,
    payload: currentUserLocation,
  }
}

export const swapJourneyStartAndDestination = () => {
  return {
    type: SWAP_JOURNEY_START_AND_DESTINATION,
  }
}

export const visibleCoordinatesUpdated = () => {
  return {
    type: VISIBLE_COORDINATES_UPDATED,
  }
}

export const resetMapState = () => {
  return {
    type: RESET_MAP_STATE,
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

export const setVans = payload => {
  return {
    type: SET_VANS,
    payload: payload,
  }
}

export const setPersonCount = payload => {
  return {
    type: SET_PERSON_COUNT,
    payload: payload,
  }
}

export default map
