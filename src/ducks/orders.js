import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
export const SET_ACTIVE_ORDER = 'orders/SET_ACTIVE_ORDER'

const initialState = {
  activeOrder: null,
  pastOrders: [],
}

function momentifyOrder(order) {
  if (!order) return order
  const moments = _.compact(
    ['orderTime', 'startTime', 'endTime'].map(t => {
      if (!order[t]) return null
      return {
        [t]: moment(order[t]),
      }
    })
  )
  return Object.assign({}, order, ...moments)
}

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_DATA:
      const orders = _.uniqBy(
        [].concat(state.pastOrders, action.payload.map(momentifyOrder)),
        'id'
      )
      const activeOrder = _.find(orders, 'active')
      return {
        ...state,
        activeOrder: activeOrder !== undefined ? activeOrder : null, // must be null or an order object. if undefined it would be removed from the redux state
        pastOrders: _.filter(orders, ['active', false]),
      }
    case SET_ACTIVE_ORDER:
      return {
        ...state,
        activeOrder: momentifyOrder(action.payload),
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
    const {data, status} = await api.get('/activeorder')
    if (status === 200) dispatch(setActiveOrder(data))
  }
}

export function placeOrder(payload) {
  return async dispatch => {
    try {
      // TODO: remove cancelActiveOrder() as soon as cancel order button works. otherwise it's not possible to place a new order as long there is another active order
      await cancelActiveOrder()(dispatch)
    } catch (err) {}

    const {data} = await api.post('/orders', payload)
    dispatch(setActiveOrder(data))
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
