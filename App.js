import React from 'react'
import Home from './src/views/Home'
import Login from './src/views/Login'
import Map from './src/views/Map'

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
