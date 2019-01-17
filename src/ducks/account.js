import api from '../lib/api'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'

const initialState = {
  address: {},
}

// reducers (pure functions, no side-effects!)
export default function account(state = initialState, action) {
  switch (action.type) {
    case SET_ACCOUNT_DATA:
      return {
        ...action.payload,
        name: action.payload.firstName + ' ' + action.payload.lastName,
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

function setAccountData(accountData) {
  return {
    type: SET_ACCOUNT_DATA,
    payload: accountData,
  }
}
