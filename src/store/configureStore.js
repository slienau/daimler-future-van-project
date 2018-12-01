import {createStore, combineReducers} from 'redux'

import account from './reducers/account'

const rootReducer = combineReducers({
  account,
})

const configureStore = () => {
  return createStore(rootReducer)
}

export default configureStore
