import api from '../lib/api'
import _ from 'lodash'
import {
  changeOrderState,
  OrderState,
  UPDATE_ROUTE_INFO,
  RESET_MAP_STATE,
} from './map'

import {fixNumbers, cleanOrderObject, momentifyOrder} from '../lib/utils'

export const SET_ACTIVE_ORDER = 'orders/SET_ACTIVE_ORDER'
export const SET_ACTIVE_ORDER_STATUS = 'orders/SET_ACTIVE_ORDER_STATUS'
export const END_RIDE = 'orders/END_RIDE'
export const START_RIDE = 'orders/START_RIDE'

const initialState = {
  activeOrder: null,
  activeOrderStatus: null,
}

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
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
    if (data.vanEnterTime) dispatch(changeOrderState(OrderState.VAN_RIDE))
    else dispatch(changeOrderState(OrderState.ROUTE_ORDERED))
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
    dispatch(changeOrderState(OrderState.EXIT_VAN))
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
      payload: data,
    })
  }
}
