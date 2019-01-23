import React from 'react'
import MainRideScreen from './MainRideScreen'
import {createStackNavigator} from 'react-navigation'
import BlankViewHeader from '../../components/ViewHeaders/BlankViewHeader'
import SubViewHeader from '../../components/ViewHeaders/SubViewHeader'
import FunfactsScreen from './FunfactsScreen'
import inRideMapScreen from './inRideMapScreen'
import GamesScreen from './GamesScreen'
import SightsScreen from './SightsScreen'

const RideScreen = createStackNavigator(
  {
    MainRideScreen: {
      screen: MainRideScreen,
      navigationOptions: ({navigation}) => ({
        header: <BlankViewHeader title="Ride view" />,
      }),
    },
    FunfactsScreen: {
      screen: FunfactsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SubViewHeader
            title="Fun Facts"
            onArrowBackPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    inRideMapScreen: {
      screen: inRideMapScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SubViewHeader
            title="Map"
            onArrowBackPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    GamesScreen: {
      screen: GamesScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SubViewHeader
            title="Games"
            onArrowBackPress={() => navigation.goBack()}
          />
        ),
      }),
    },
    SightsScreen: {
      screen: SightsScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SubViewHeader
            title="Sights"
            onArrowBackPress={() => navigation.goBack()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'MainRideScreen',
  }
)

export default RideScreen
