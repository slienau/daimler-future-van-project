import React from 'react'
import Home from './views/Home'
import Login from './views/Login'
import Map from './views/Map'

import {createStackNavigator} from 'react-navigation'

const RootStack = createStackNavigator(
  {
    Home,
    Login,
    Map,
  },
  {
    initialRouteName: 'Home',
  }
)

const App = () => {
  return <RootStack />
}

export default App
