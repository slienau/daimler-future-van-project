import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
} from 'react-navigation'
import {Provider} from 'react-redux'
import {configureStore} from './store'
import {Root} from 'native-base'
import {PermissionsAndroid} from 'react-native'

// screens
import LoadingScreen from '../views/LoadingScreen'
import LoginScreen from '../views/LoginScreen'
import MapScreen from '../views/MapScreen'
import AccountScreen from '../views/AccountScreen'
import SearchScreen from '../views/SearchScreen'
import OrderHistoryScreen from '../views/OrderHistoryScreen'
import OrderHistoryDetailsScreen from '../views/OrderHistoryDetailsScreen'
import LeaderboardScreen from '../views/LeaderboardScreen'
import RideScreen from '../views/RideScreen'
import FunfactsScreen from '../views/FunfactsScreen'
import InRideMapScreen from '../views/InRideMapScreen'
// import GamesScreen from '../views/GamesScreen'
// import SightsScreen from '../views/SightsScreen'

// components
import DefaultScreenHeader from '../components/UI/DefaultScreenHeader'

const MainAppStack = createStackNavigator(
  {
    Account: {
      screen: AccountScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <DefaultScreenHeader
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
          <DefaultScreenHeader
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
      navigationOptions: ({navigation}) => ({
        header: (
          <DefaultScreenHeader
            title="Search Place"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    OrderHistory: {
      screen: OrderHistoryScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <DefaultScreenHeader
            title="Order History"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    OrderHistoryDetails: {
      screen: OrderHistoryDetailsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <DefaultScreenHeader
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
          <DefaultScreenHeader
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
          <DefaultScreenHeader
            title="Map"
            onPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    // Games: {
    //   screen: GamesScreen,
    //   navigationOptions: ({navigation}) => ({
    //     header: (
    //       <CustomScreenHeader
    //         title="Games"
    //         onPress={() => navigation.goBack()}
    //       />
    //     ),
    //   }),
    // },
    // Sights: {
    //   screen: SightsScreen,
    //   navigationOptions: ({navigation}) => ({
    //     header: (
    //       <CustomScreenHeader
    //         title="Sights"
    //         onPress={() => navigation.goBack()}
    //       />
    //     ),
    //   }),
    // },
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
    this.requestLocationPermission()
    const store = configureStore()
    this.setState({store})
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Daimler Van needs access to your location in order to work.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )
      if (granted !== PermissionsAndroid.RESULTS.GRANTED)
        console.log('Location permission denied')
    } catch (err) {
      console.warn(err)
    }
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
