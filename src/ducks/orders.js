import api from '../lib/api'
import moment from 'moment'
import _ from 'lodash'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
export const CREATE_ORDER = 'orders/CREATE_ORDER'
export const CHANGE_ORDER = 'orders/CHANGE_ORDER'

const initialState = {
  activeOrder: null,
  pastOrders: [],
}

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_DATA:
      const newState = _.cloneDeep(state)
      action.payload.forEach(order => {
        order.orderTime = moment(order.orderTime)
        order.startTime = moment(order.startTime)
        order.endTime = moment(order.endTime)
        // we can only have one active order at the time
        if (order.active) newState.activeOrder = order
        else {
          // don't push duplicate orders to the pastOrders array
          if (
            !newState.pastOrders.some(someOrder => someOrder._id === order._id)
          )
            newState.pastOrders.push(order)
        }
      })
      return {
        ...state,
        activeOrder: newState.activeOrder,
        pastOrders: newState.pastOrders,
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

export function fetchActiveOrders() {
  fetchOrders(true)
}

function setOrderData(orderData) {
  return {
    type: SET_ORDER_DATA,
    payload: orderData,
  }
}