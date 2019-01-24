import React from 'react'
import AccountScreen from './AccountScreen'
import LeaderBoardScreen from './LeaderBoardScreen'
import {createStackNavigator} from 'react-navigation'
import MainViewHeader from '../../components/ViewHeaders/MainViewHeader'
import SubViewHeader from '../../components/ViewHeaders/SubViewHeader'

const Account = createStackNavigator(
  {
    Account: {
      screen: AccountScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <MainViewHeader
            title="Account"
            onMenuPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    LeaderBoard: {
      screen: LeaderBoardScreen,
      navigationOptions: ({navigation}) => ({
        header: (
          <SubViewHeader
            title="Leaderboard"
            onArrowBackPress={() => navigation.goBack()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'Account',
    navigationOptions: {
      tabBarLabel: 'Account', // would be used by createBottomTabNavigator(Orders)
    },
  }
)

export default Account
