import {combineReducers} from 'redux'

import account from '../ducks/account'
import map from '../ducks/map'

const rootReducer = combineReducers({
  account,
  map,
})

export default rootReducer
