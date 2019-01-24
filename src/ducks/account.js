import api from '../lib/api'

export const SET_ACCOUNT_DATA = 'account/SET_ACCOUNT_DATA'
export const GET_LEADERBOARD_DATA = 'account/GET_LEADERBOARD_DATA'

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
    case GET_LEADERBOARD_DATA:
      const getLeaders = []
      for (var i = 0; i < action.payload.length; i++) {
        getLeaders[i] = action.payload[i].loyaltyPoints
      }
      return {
        ...state,
        leaders: getLeaders,
      }
    default:
      return state
  }
}

export function fetchLeaderBoardData() {
  return async dispatch => {
    const {data} = await api.get('/leaderboard')
    dispatch(getLeaderBoardData(data))
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

function getLeaderBoardData(leaderBoardData) {
  return {
    type: GET_LEADERBOARD_DATA,
    payload: leaderBoardData,
  }
}
