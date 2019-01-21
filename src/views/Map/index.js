import React from 'react'
import {createStackNavigator} from 'react-navigation'
import SearchScreen from './SearchScreen'
import {Icon} from 'native-base'
import MapScreen from './MapScreen'
import RideScreen from '../RideScreen'

// we create a stack navigator with the map as default and the search view, so that it can be placed on top
// of the map to get the start and destination
export default createStackNavigator(
  {
    Map: {
      screen: MapScreen,
      navigationOptions: () => ({
        header: null,
        drawerIcon: () => <Icon name="map" />,
      }),
    },
    Search: {
      screen: SearchScreen,
    },
    RideScreen: {
      screen: RideScreen,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'Map',
  }
)
