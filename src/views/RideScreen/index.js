import React from 'react'
import MainRideScreen from './MainRideScreen'
import {createStackNavigator} from 'react-navigation'
import MainViewHeader from '../../components/ViewHeaders/MainViewHeader'

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
  },
  {
    initialRouteName: 'MainRideScreen',
  }
)

export default RideScreen
