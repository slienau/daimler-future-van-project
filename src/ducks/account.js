import api from '../lib/api'
import _ from 'lodash'
import {fixNumbers, cleanOrderObject, momentifyOrder} from '../lib/utils'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'
export const SET_LEADERBOARD_DATA = 'account/SET_LEADERBOARD_DATA'
export const SET_PAST_ORDERS = 'orders/SET_PAST_ORDERS'

const initialState = {
  address: {},
  leaders: [],
  pastOrders: [],
}

// reducers (pure functions, no side-effects!)
export default function account(state = initialState, action) {
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
    case SET_ACCOUNT_DATA:
      return {
        ...state,
        ...action.payload,
        name: action.payload.firstName + ' ' + action.payload.lastName,
      }
    case SET_LEADERBOARD_DATA:
      return {
        ...state,
        leaders: _.concat([], action.payload),
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchAccountData() {
  return async dispatch => {
    const {data} = await api.get('/account')
    dispatch({
      type: SET_ACCOUNT_DATA,
      payload: data,
    })
  }
}

export function fetchLeaderBoardData() {
  return async dispatch => {
    const {data} = await api.get('/leaderboard')
    dispatch({
      type: SET_LEADERBOARD_DATA,
      payload: data,
    })
  }
}

export function fetchPastOrders() {
  return async dispatch => {
    const {data} = await api.get('/orders')
    const pastOrders = _.filter(data, ['active', false])
    dispatch({
      type: SET_PAST_ORDERS,
      payload: pastOrders,
    })
  }
}
