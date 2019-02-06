import {combineReducers} from 'redux'

import account from '../ducks/account'
import map from '../ducks/map'
import orders from '../ducks/orders'
import errors from '../ducks/errors'

const rootReducer = combineReducers({
  account,
  map,
  orders,
  errors,
})

export default rootReducer
