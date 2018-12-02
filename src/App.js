import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {Provider} from 'react-redux'

import LoadingScreen from './views/LoadingScreen'
import Login from './views/Login'
import Welcome from './views/Welcome'
import Account from './views/Account'
import Games from './views/Games'
import Information from './views/Information'
import {configureStore} from './init/store'

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

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      LoadingScreen,
      Login,
      MainView,
    },
    {
      initialRouteName: 'LoadingScreen',
    }
  )
)

export default class App extends React.Component {
  state = {
    store: null,
  }

  async componentDidMount() {
    const store = await configureStore()
    this.setState({store})
  }

  render() {
    const {store} = this.state
    if (store === null) return null
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    )
  }
}
