import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'
import {changeMapState, setRoutes, resetMapState, MapState} from './map'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
export const SET_ACTIVE_ORDER = 'orders/SET_ACTIVE_ORDER'
export const SET_ACTIVE_ORDER_STATUS = 'orders/SET_ACTIVE_ORDER_STATUS'

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

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_DATA:
      const orders = _.uniqBy(
        [].concat(state.pastOrders, action.payload.map(momentifyOrder)),
        'id'
      ).map(order => fixNumbers(order))
      return {
        ...state,
        activeOrder: _.find(orders, 'active') || null,
        pastOrders: _.filter(orders, ['active', false]),
      }
    case SET_ACTIVE_ORDER:
      return {
        ...state,
        activeOrder: fixNumbers(momentifyOrder(action.payload)),
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
    dispatch(setOrderData(data))
  }
}

export function fetchActiveOrder() {
  return async dispatch => {
    try {
      const {data, status} = await api.get('/activeorder')
      if (status !== 200) return
      // currently there is an active order, so set the state correctly
      dispatch(setActiveOrder(data))
      dispatch(setRoutes([data.route]))
      dispatch(changeMapState(MapState.ROUTE_ORDERED))
    } catch (e) {}
  }
}

export function placeOrder(payload) {
  return async dispatch => {
    const {data} = await api.post('/orders', payload)
    dispatch(setActiveOrder(data))
    dispatch(changeMapState(MapState.ROUTE_ORDERED))
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
    dispatch(setActiveOrder(null)) // won't be done if put response code is not 200 because .put() throws an error
    dispatch(resetMapState())
  }
}

function setOrderData(orderData) {
  return {
    type: SET_ORDER_DATA,
    payload: orderData,
  }
}

function setActiveOrder(orderData) {
  return {
    type: SET_ACTIVE_ORDER,
    payload: orderData,
  }
}

export function setActiveOrderStatus(state) {
  return {
    type: SET_ACTIVE_ORDER_STATUS,
    payload: state,
  }
}
