import {combineReducers} from 'redux'

import account from '../ducks/account'

const rootReducer = combineReducers({
  account,
})

export default rootReducer
