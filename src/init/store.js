import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

let store = null

async function configureStore() {
  store = createStore(rootReducer, applyMiddleware(thunk))
  return store
}

const getStore = () => store

export {configureStore, getStore}
