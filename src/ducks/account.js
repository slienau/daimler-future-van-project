import api from '../lib/api'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'
export const SET_LEADERBOARD_DATA = 'account/SET_LEADERBOARD_DATA'

const initialState = {
  address: {},
  leaders: [],
}

// reducers (pure functions, no side-effects!)
export default function account(state = initialState, action) {
  switch (action.type) {
    case SET_ACCOUNT_DATA:
      return {
        ...action.payload,
        name: action.payload.firstName + ' ' + action.payload.lastName,
      }
    case SET_LEADERBOARD_DATA:
      return {
        ...state,
        leaders: action.payload,
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

export function fetchLeaderBoardData() {
  return async dispatch => {
    const {data} = await api.get('/leaderboard')
    dispatch(setLeaderBoardData(data))
  }
}

function setLeaderBoardData(leaderBoardData) {
  return {
    type: SET_LEADERBOARD_DATA,
    payload: leaderBoardData,
  }
}
