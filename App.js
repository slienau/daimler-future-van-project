import React from 'react'
import Home from './src/views/Home'
import Login from './src/views/Login'

import {createStackNavigator} from 'react-navigation'

const RootStack = createStackNavigator(
  {
    Home,
    Login,
  },
  {
    initialRouteName: 'Home',
  }
)

const App = () => {
  return <RootStack />
}

export default App
