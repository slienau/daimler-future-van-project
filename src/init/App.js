import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
} from 'react-navigation'
import {Provider} from 'react-redux'
import {configureStore} from './store'
import {Root} from 'native-base'

// screens
import LoadingScreen from '../views/LoadingScreen'
import LoginScreen from '../views/LoginScreen'
import MapScreen from '../views/MapScreen'
import AccountScreen from '../views/AccountScreen'
import SearchScreen from '../views/SearchScreen'
import PastOrdersScreen from '../views/PastOrdersScreen'
import PastOrderDetailsScreen from '../views/PastOrderDetailsScreen'
import LeaderboardScreen from '../views/LeaderboardScreen'
import RideScreen from '../views/RideScreen'
import FunfactsScreen from '../views/FunfactsScreen'
import InRideMapScreen from '../views/InRideMapScreen'
import GamesScreen from '../views/GamesScreen'
import SightsScreen from '../views/SightsScreen'

// components
import CustomScreenHeader from '../components/UI/CustomScreenHeader'

const MainAppStack = createStackNavigator(
  {
    Account: {
      screen: AccountScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title="Account"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    Leaderboard: {
      screen: LeaderboardScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title="Leaderboard"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    Map: {
      screen: MapScreen,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Search: {
      screen: SearchScreen,
    },
    PastOrders: {
      screen: PastOrdersScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title="Order History"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    PastOrderDetails: {
      screen: PastOrderDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title={navigation.state.params.order.orderTime.format('L')}
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    Ride: {
      screen: RideScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Funfacts: {
      screen: FunfactsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title="Fun Facts"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    InRideMap: {
      screen: InRideMapScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader title="Map" onPress={() => navigation.goBack()} />
        ),
      }),
    },
    Games: {
      screen: GamesScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title="Games"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    Sights: {
      screen: SightsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <CustomScreenHeader
            title="Sights"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'Map',
  }
)

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      Login: LoginScreen,
      MainAppStack: MainAppStack,
    },
    {
      initialRouteName: 'Loading',
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
