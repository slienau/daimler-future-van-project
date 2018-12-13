import {AsyncStorage} from 'react-native'
import api, {setToken} from '../lib/api'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'
export const SET_ERROR = 'account/SET_ERROR'

// reducers (pure functions, no side-effects!)
export default function account(state = {}, action) {
  switch (action.type) {
    case SET_ACCOUNT_DATA:
      const fullName = action.payload.firstName + ' ' + action.payload.lastName
      return {
        ...state,
        name: fullName,
        street: action.payload.address.street,
        city: action.payload.address.city,
        zip: action.payload.address.zipcode,
        error: false,
      }
    case SET_ERROR:
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchAccountData() {
  return async dispatch => {
    try {
      const response = await api.get('/account')
      dispatch(setAccountData(response.data))
    } catch (error) {
      alert('Something went wrong while fetching account data')
      console.log(error)
      dispatch(setError())
    }
  }
}

export function login({username, password}) {
  return async dispatch => {
    const {data} = await api.post('/login', {username, password})
    await AsyncStorage.setItem('token', data.token)
    setToken(data.token)
  }
}

function setAccountData(accountData) {
  return {
    type: SET_ACCOUNT_DATA,
    payload: accountData,
  }
}

function setError() {
  return {
    type: SET_ERROR,
  }
}
