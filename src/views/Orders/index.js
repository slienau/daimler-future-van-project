import React from 'react'
import OrderDetail from './OrderDetail'
import OrderList from './OrderList'
import {createStackNavigator} from 'react-navigation'
import MainViewHeader from '../../components/ViewHeaders/MainViewHeader'
import SubViewHeader from '../../components/ViewHeaders/SubViewHeader'

const Orders = createStackNavigator(
  {
    OrderList: {
      screen: OrderList,
      navigationOptions: ({navigation}) => ({
        header: (
          <MainViewHeader
            title="Orders"
            onMenuPress={() => navigation.openDrawer()}
          />
        ),
      }),
    },
    OrderDetail: {
      screen: OrderDetail,
      navigationOptions: ({navigation}) => ({
        header: (
          <SubViewHeader
            title={navigation.state.params.order.orderTime.format('L')}
            onArrowBackPress={() => navigation.goBack()}
          />
        ),
      }),
    },
  },
  {
    initialRouteName: 'OrderList',
    navigationOptions: {
      tabBarLabel: 'Orders', // would be used by createBottomTabNavigator(Orders)
    },
  }
)

export default Orders
