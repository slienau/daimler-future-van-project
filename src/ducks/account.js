export const GET_ACCOUNT_DATA = 'GET_ACCOUNT_DATA'
export const UPDATE_ACCOUNT_DATA = 'UPDATE_ACCOUNT_DATA'

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

export default function account(state = initialState, action) {
  switch (action.type) {
    case GET_ACCOUNT_DATA:
      return {
        ...state,
      }
    case UPDATE_ACCOUNT_DATA:
      return {
        ...state,
      }
    default:
      return state
  }
}

export function getAccountData() {
  return {
    type: GET_ACCOUNT_DATA,
  }
}

export function updateAccountData(newAccountData) {
  return {
    type: UPDATE_ACCOUNT_DATA,
    newAccountData,
  }
}
