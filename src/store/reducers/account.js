import {
  GET_ACCOUNT_DATA,
  UPDATE_ACCOUNT_DATA,
  ENABLE_ACCOUNT_VISIBILITY,
  DISABLE_ACCOUNT_VISIBILITY,
} from './../actions/actionTypes'

const initialState = {
  name: 'Vorname Nachname',
  email: 'somemail@example.com',
  username: 'username',
  street: 'Long Street',
  zip: 99999,
  city: 'NotBerlin',
  points: 768,
  miles: 46,
  visible: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNT_DATA:
      return {
        ...state,
      }
    case UPDATE_ACCOUNT_DATA:
      return {
        ...state,
      }
    case ENABLE_ACCOUNT_VISIBILITY:
      return {
        ...state,
        visible: true,
      }
    case DISABLE_ACCOUNT_VISIBILITY:
      return {
        ...state,
        visible: false,
      }
    default:
      return state
  }
}

export default reducer
