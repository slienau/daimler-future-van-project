import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'
import {
  changeMapState,
  MapState,
  UPDATE_ROUTE_INFO,
  RESET_MAP_STATE,
} from './map'

export const SET_PAST_ORDERS = 'orders/SET_PAST_ORDERS'
export const SET_ACTIVE_ORDER = 'orders/SET_ACTIVE_ORDER'
export const SET_ACTIVE_ORDER_STATUS = 'orders/SET_ACTIVE_ORDER_STATUS'
export const END_RIDE = 'orders/END_RIDE'
export const START_RIDE = 'orders/START_RIDE'

const initialState = {
  activeOrder: null,
  activeOrderStatus: null,
  pastOrders: [],
}

function momentifyOrder(order) {
  if (!order) return order
  const moments = _.compact(
    ['orderTime', 'vanEnterTime', 'vanExitTime'].map(t => {
      if (!order[t]) return null
      return {
        [t]: moment(order[t]),
      }
    })
  )
  return Object.assign({}, order, ...moments)
}

function fixNumbers(order) {
  if (!order) return order
  if (_.isNumber(order.co2savings))
    order.co2savings = order.co2savings.toFixed(2)
  if (_.isNumber(order.distance)) order.distance = order.distance.toFixed(2)
  if (_.isNumber(order.loyaltyPoints))
    order.loyaltyPoints = order.loyaltyPoints.toFixed(0)
  return order
}

function cleanOrderObject(order) {
  return {
    ...order,
    route: undefined,
    accountId: undefined,
  }
}

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
    case SET_PAST_ORDERS:
      const orders = _.uniqBy(
        [].concat(state.pastOrders, action.payload.map(momentifyOrder)),
        'id'
      ).map(order => fixNumbers(cleanOrderObject(order)))
      return {
        ...state,
        pastOrders: _.filter(orders, ['active', false]),
      }
    case SET_ACTIVE_ORDER:
      return {
        ...state,
        activeOrder: cleanOrderObject(
          fixNumbers(momentifyOrder(action.payload))
        ),
      }
    case SET_ACTIVE_ORDER_STATUS:
      return {
        ...state,
        activeOrderStatus: action.payload,
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchOrders() {
  return async dispatch => {
    const {data} = await api.get('/orders')
    const activeOrder = _.find(data, 'active') || null
    if (activeOrder) dispatch(onSetActiveOrder(activeOrder))
    const pastOrders = _.filter(data, ['active', false])
    dispatch({
      type: SET_PAST_ORDERS,
      payload: pastOrders,
    })
  }
}

const onSetActiveOrder = data => {
  return dispatch => {
    dispatch({
      type: SET_ACTIVE_ORDER,
      payload: data,
    })
    dispatch({
      type: UPDATE_ROUTE_INFO,
      payload: data.route,
    })
    dispatch(changeMapState(MapState.ROUTE_ORDERED))
  }
}

export function fetchActiveOrder() {
  return async dispatch => {
    try {
      const {data, status} = await api.get('/activeorder')
      if (status !== 200) return
      dispatch(onSetActiveOrder(data))
    } catch (e) {}
  }
}

export function placeOrder(payload) {
  return async dispatch => {
    const {data} = await api.post('/orders', payload)
    dispatch(onSetActiveOrder(data))
  }
}

export function cancelActiveOrder() {
  return async dispatch => {
    await api.put('/activeorder', {
      action: 'cancel',
      userLocation: {
        latitude: 1,
        longitude: 1,
      },
    })
    dispatch({
      type: SET_ACTIVE_ORDER,
      payload: null,
    }) // won't be done if put response code is not 200 because .put() throws an error
    dispatch({
      type: RESET_MAP_STATE,
    })
  }
}

export function startRide() {
  return async (dispatch, getState) => {
    dispatch({
      type: START_RIDE,
    })
    const {map} = getState()
    const {data} = await api.put('/activeorder', {
      action: 'startride',
      userLocation: _.pick(map.currentUserLocation, ['latitude', 'longitude']),
    })
    dispatch(onSetActiveOrder(data))
  }
}

export function endRide() {
  return async (dispatch, getState) => {
    dispatch({
      type: END_RIDE,
    })
    const {map} = getState()
    await api.put('/activeorder', {
      action: 'endride',
      userLocation: _.pick(map.currentUserLocation, ['latitude', 'longitude']),
    })
    dispatch(changeMapState(MapState.EXIT_VAN))
  }
}

export function setActiveOrderStatus(data) {
  return dispatch => {
    dispatch({
      type: SET_ACTIVE_ORDER_STATUS,
      payload: _.pick(data, [
        'vanId',
        'userAllowedToEnter',
        'userAllowedToExit',
        'vanLocation',
        'otherPassengers',
        'message',
        'nextStops',
        'nextRoutes',
      ]),
    })
    dispatch({
      type: UPDATE_ROUTE_INFO,
      payload: {
        vanLocation: data.vanLocation,
        vanETAatStartVBS: data.vanETAatStartVBS,
        vanETAatEndVBS: data.vanETAatDestinationVBS, // TODO: rename vanETAatDestinationVBS to vanETAatEndVBS in API
        userETAatUserDestinationLocation: data.userETAatUserDestinationLocation,
        guaranteedArrivalTime: data.guaranteedArrivalTime,
      },
    })
  }
}
