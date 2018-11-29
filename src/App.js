import React from 'react'
import Home from './views/Home'
import Login from './views/Login'
import Map from './views/Map'
import AccountDetails from './views/AccountDetails'

import {createStackNavigator} from 'react-navigation'

const RootStack = createStackNavigator(
  {
    Home,
    Login,
    Map,
    AccountDetails,
  },
  {
    initialRouteName: 'Home',
  }
)

const App = () => {
  return <RootStack />
}

export default App
