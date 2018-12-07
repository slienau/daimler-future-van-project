import axios from 'axios'

export const FETCH_ACCOUNT_DATA = 'account/FETCH_ACCOUNT_DATA'
export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'

const initialState = {
  name: 'Vorname Nachname',
  email: 'somemail@example.com',
  username: 'username',
  street: 'Long Street',
  zip: 99999,
  city: 'NotBerlin',
  points: 768,
  miles: 46,
}

// reducers (pure functions, no side-effects!)
export default function account(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACCOUNT_DATA:
      return {
        ...state,
      }
    case SET_ACCOUNT_DATA:
      const fullName = action.payload.firstName + ' ' + action.payload.lastName
      return {
        ...state,
        name: fullName,
        street: action.payload.address.street,
        city: action.payload.address.city,
        zip: action.payload.address.zipcode,
      }
    default:
      return state
  }
}

// actions (can cause side-effects)
export function fetchAccountData() {
  return dispatch => {
    axios
      .get('http://40.89.170.229:8080/accounts/1234')
      .catch(error => {
        alert('Something went wrong')
        console.log(error)
      })
      .then(response => {
        console.log(response.data)
        dispatch(setAccountData(response.data))
      })
  }
}

export function setAccountData(accountData) {
  return {
    type: SET_ACCOUNT_DATA,
    payload: accountData,
  }
}
