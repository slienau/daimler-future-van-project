import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
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
    dispatch(setOrderData([data]))
  }
}

export function cancelOrder(payload) {
  return async dispatch => {
    const {data} = await api.put('/orders/' + payload.id, payload.updatedOrder)
    dispatch(setOrderData([data]))
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
