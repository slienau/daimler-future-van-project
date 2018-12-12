import {combineReducers} from 'redux'

import account from '../ducks/account'
import orders from '../ducks/orders'

const rootReducer = combineReducers({
  account,
  orders,
})

export default rootReducer
