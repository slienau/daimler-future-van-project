import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation'
import {Provider} from 'react-redux'

import LoadingScreen from '../views/LoadingScreen'
import Login from '../views/Login'
import Map from '../views/Map'
import Account from '../views/Account'
import Orders from '../views/Orders'
import Games from '../views/Games'
import {configureStore} from './store'
import {Root} from 'native-base'

const MainView = createDrawerNavigator(
  {
    Account,
    Map,
    Orders,
    Games,
  },
  {
    initialRouteName: 'Map',
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

  componentDidMount() {
    const store = configureStore()
    this.setState({store})
  }

  render() {
    const {store} = this.state
    if (store === null) return null
    return (
      <Provider store={store}>
        <Root>
          <AppNavigator />
        </Root>
      </Provider>
    )
  }
}
