import {
  GET_ACCOUNT_DATA,
  UPDATE_ACCOUNT_DATA,
  ENABLE_ACCOUNT_VISIBILITY,
  DISABLE_ACCOUNT_VISIBILITY,
} from './actionTypes'

export const getAccountData = () => {
  return {
    type: GET_ACCOUNT_DATA,
  }
}

export const updateAccountData = newAccountData => {
  return {
    type: UPDATE_ACCOUNT_DATA,
    newAccountData: newAccountData,
  }
}

export const enableAccountVisibility = () => {
  return {
    type: ENABLE_ACCOUNT_VISIBILITY,
  }
}

export const disableAccountVisibility = () => {
  return {
    type: DISABLE_ACCOUNT_VISIBILITY,
  }
}
