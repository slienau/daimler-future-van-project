import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

let store = null

let composeEnhancers = compose

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

async function configureStore() {
  store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
  return store
}

const getStore = () => store

export {configureStore, getStore}
