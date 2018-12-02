import {createStore} from 'redux'

import rootReducer from './rootReducer'

let store = null

async function configureStore() {
  store = createStore(rootReducer)
  return store
}

const getStore = () => store

export {configureStore, getStore}
