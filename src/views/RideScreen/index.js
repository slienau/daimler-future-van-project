import React from 'react'
import MainRideScreen from './MainRideScreen'
import {createStackNavigator} from 'react-navigation'
import MainViewHeader from '../../components/ViewHeaders/MainViewHeader'
import SubViewHeader from '../../components/ViewHeaders/SubViewHeader'
import FunfactsScreen from './FunfactsScreen'

const RideScreen = createStackNavigator(
  {
    MainRideScreen: {
      screen: MainRideScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <MainViewHeader
            title="Ride view"
            onMenuPress={() => navigation.openDrawer()}
          />
        ),
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
  },
  {
    initialRouteName: 'MainRideScreen',
  }
)

export default RideScreen
