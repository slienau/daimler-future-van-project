import React from 'react'
import LoadingScreen from './views/LoadingScreen'
import Login from './views/Login'
import Welcome from './views/Welcome'
import Account from './views/Account'
import Games from './views/Games'
import Information from './views/Information'

import {createSwitchNavigator} from 'react-navigation'

const MainView = createSwitchNavigator(
  {
    Account,
    Welcome,
    Games,
    Information,
  },
  {
    initialRouteName: 'Welcome',
  }
)

const RootNavigator = createSwitchNavigator(
  {
    LoadingScreen,
    Login,
    MainView,
  },
  {
    initialRouteName: 'LoadingScreen',
  }
)

const App = () => {
  return <RootNavigator />
}

export default App
