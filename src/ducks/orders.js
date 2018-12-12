import api from '../lib/api'
import {deepCopy} from '../lib/utils'

export const SET_ORDER_DATA = 'orders/SET_ORDER_DATA'
export const CREATE_ORDER = 'orders/CREATE_ORDER'
export const CHANGE_ORDER = 'orders/CHANGE_ORDER'
export const SET_ERROR = 'orders/SET_ERROR'
export const SET_LOADING = 'orders/SET_LOADING'

const initialState = {
  activeOrder: null,
  pastOrders: [],
  loading: false,
  error: false,
}

// reducers (pure functions, no side-effects!)
export default function orders(state = initialState, action) {
  switch (action.type) {
    case SET_ORDER_DATA:
      const newState = deepCopy(state)
      action.payload.forEach(order => {
        // we can only have one active order at the time
        if (order.active) newState.activeOrder = order
        else {
          // don't push duplicate orders to the pastOrders array
          if (!newState.pastOrders.some(someOrder => someOrder.id === order.id))
            newState.pastOrders.push(order)
        }
      })
      return {
        ...state,
        activeOrder: newState.activeOrder,
        pastOrders: newState.pastOrders,
        error: false,
        loading: false,
      }
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      }
    case SET_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchOrders(active, fromDate, toDate) {
  return async dispatch => {
    try {
      dispatch(setLoading())
      const response = await api.get('/orders') // TODO: set query parameters according to API
      dispatch(setOrderData(response.data))
    } catch (error) {
      alert('Something went wrong while fetching orders')
      console.log(error)
      dispatch(setError())
    }
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

function setLoading() {
  return {
    type: SET_LOADING,
  }
}

function setError() {
  return {
    type: SET_ERROR,
  }
}
