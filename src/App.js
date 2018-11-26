import React, {Component} from 'react'
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
    Welcome: {
      screen: Welcome,
      navigationOptions: ({navigation}) => ({
        header: () => null,
      }),
    },
    Account,
    Games,
    Information,
  },
  {
    initialRouteName: 'Welcome',
  }
)

export default class App extends Component {
  state = {
    user: null,
  }
  setUser(user) {
    this.setState({user})
  }
  render() {
    if (!this.state.user) return <Login onLogin={user => this.setUser(user)} />
    return <RootStack />
  }
}
