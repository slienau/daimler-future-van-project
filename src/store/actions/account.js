import {GET_ACCOUNT_DATA, UPDATE_ACCOUNT_DATA} from './actionTypes'

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
