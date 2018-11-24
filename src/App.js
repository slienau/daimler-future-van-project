import React from 'react'
import Home from './views/Home'
import Login from './views/Login'
import Map from './views/Map'
import Welcome from './views/Welcome'
import Account from './views/Account'
import Games from './views/Games'
import Information from './views/Information'

import {createStackNavigator} from 'react-navigation'

const RootStack = createStackNavigator(
  {
    Home,
    Login,
    Map,
    Welcome,
    Account,
    Games,
    Information,
  },
  {
    initialRouteName: 'Home',
  }
)

const App = () => {
  return <RootStack />
}

export default App
