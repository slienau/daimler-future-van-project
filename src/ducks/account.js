import api from '../lib/api'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'
export const SET_ERROR = 'account/SET_ERROR'

const initialState = {
  name: null,
  email: 'somemail@example.com',
  username: 'username',
  street: null,
  zip: null,
  city: null,
  points: 768,
  miles: 46,
  error: false,
}

// reducers (pure functions, no side-effects!)
export default function account(state = initialState, action) {
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
