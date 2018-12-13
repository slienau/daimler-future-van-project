import {combineReducers} from 'redux'

import account from '../ducks/account'
import map from '../ducks/map'
import orders from '../ducks/orders'

const rootReducer = combineReducers({
  account,
  map,
  orders,
})

export default rootReducer
