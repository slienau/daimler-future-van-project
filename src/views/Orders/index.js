import OrderDetail from './OrderDetail'
import OrderList from './OrderList'
import {createStackNavigator} from 'react-navigation'

const Orders = createStackNavigator(
  {
    OrderList: {
      screen: OrderList,
    },
    OrderDetail: {
      screen: OrderDetail,
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
