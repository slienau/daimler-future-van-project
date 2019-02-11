import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'
import {changeMapState, MapState, SET_ROUTE_INFO, RESET_MAP_STATE} from './map'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
export const SET_ACTIVE_ORDER = 'orders/SET_ACTIVE_ORDER'
export const SET_ACTIVE_ORDER_STATUS = 'orders/SET_ACTIVE_ORDER_STATUS'
export const END_RIDE = 'orders/END_RIDE'

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
    dispatch({
      type: SET_ORDER_DATA,
      payload: data,
    })
  }
}

const onSetActiveOrder = data => {
  return dispatch => {
    dispatch({
      type: SET_ACTIVE_ORDER,
      payload: {
        ...data,
        route: undefined,
      },
    })
    dispatch({
      type: SET_ROUTE_INFO,
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
      // currently there is an active order, so set the state correctly
      // dispatch({
      //   type: SET_ACTIVE_ORDER,
      //   payload: {
      //     ...data,
      //     route: undefined,
      //   },
      // })
      // dispatch({
      //   type: SET_ROUTE_INFO,
      //   payload: data.route,
      // })
      // dispatch(changeMapState(MapState.ROUTE_ORDERED))
      dispatch(onSetActiveOrder(data))
    } catch (e) {}
  }
}

export function placeOrder(payload) {
  return async dispatch => {
    const {data} = await api.post('/orders', payload)
    // dispatch({
    //   type: SET_ACTIVE_ORDER,
    //   payload: data,
    // })
    // dispatch(changeMapState(MapState.ROUTE_ORDERED))
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

export function setActiveOrderStatus(state) {
  return {
    type: SET_ACTIVE_ORDER_STATUS,
    payload: state,
  }
}
