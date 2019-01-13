import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
export const SET_ACTIVE_ORDER = 'orders/SET_ACTIVE_ORDER'
export const PLACE_ORDER = 'orders/PLACE_ORDER'
export const CANCEL_ORDER = 'orders/CANCEL_ORDER'

const initialState = {
  activeOrder: null,
  pastOrders: [],
}

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_DATA:
      const orders = _.uniqBy(
        [].concat(
          state.pastOrders,
          action.payload.map(order => {
            const moments = ['order', 'start', 'end'].map(t => ({
              [`${t}Time`]: moment(order[`${t}Time`]),
            }))
            return Object.assign({}, order, ...moments)
          })
        ),
        '_id'
      )
      return {
        ...state,
        activeOrder: _.find(orders, 'active'),
        pastOrders: _.filter(orders, ['active', false]),
      }
    case SET_ACTIVE_ORDER:
      return {
        ...state,
        activeOrder: action.payload,
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchOrders(active, fromDate, toDate) {
  return async dispatch => {
    const {data} = await api.get('/orders') // TODO: set query parameters according to API
    dispatch(setOrderData(data))
  }
}

export function placeOrder(payload) {
  return async dispatch => {
    const {data} = await api.post('/orders', payload)
    dispatch(setActiveOrder(data))
  }
}

export function cancelOrder(id) {
  return async dispatch => {
    const {data} = await api.put('/orders/' + id, {canceled: true})
    console.log('cancelOrder', data)
    // TODO update store
  }
}

export function cancelActiveOrder() {
  return async (dispatch, getState) => {
    const {activeOrder} = getState().orders
    cancelOrder(activeOrder._id)(dispatch)
  }
}

export function fetchActiveOrders() {
  fetchOrders(true)
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
