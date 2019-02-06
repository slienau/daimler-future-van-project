export const SET_NETWORK_TIMEOUT_ERROR = 'errors/SET_NETWORK_TIMEOUT_ERROR'

const initialState = {
  networkTimeout: false,
}

export default function errors(state = initialState, action) {
  switch (action.type) {
    case SET_NETWORK_TIMEOUT_ERROR:
      return {
        ...state,
        networkTimeout: action.payload,
      }
    default:
      return state
  }
}

export function setNetworkTimeoutError(isError) {
  return {
    type: SET_NETWORK_TIMEOUT_ERROR,
    payload: isError,
  }
}
