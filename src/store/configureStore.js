import {createStore, combineReducers} from 'redux'

import accountReducer from './reducers/account'

const rootReducer = combineReducers({
  account: accountReducer,
})

const configureStore = () => {
  return createStore(rootReducer)
}

export default configureStore
