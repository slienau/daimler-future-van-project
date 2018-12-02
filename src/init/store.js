import {createStore} from 'redux'

import rootReducer from './rootReducer'

const store = () => {
  return createStore(rootReducer)
}

export default store
