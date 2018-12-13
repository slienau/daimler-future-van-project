import {AsyncStorage} from 'react-native'
import api, {setToken} from '../lib/api'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'

// reducers (pure functions, no side-effects!)
export default function account(state = {}, action) {
  switch (action.type) {
    case SET_ACCOUNT_DATA:
      const fullName = action.payload.firstName + ' ' + action.payload.lastName
      return {
        ...state,
        name: fullName,
        username: action.payload.username,
        email: action.payload.email,
        street: action.payload.street,
        city: action.payload.city,
        zip: action.payload.zipcode,
        error: false,
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchAccountData() {
  return async dispatch => {
    const {data} = await api.get('/account')
    dispatch(setAccountData(data))
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
