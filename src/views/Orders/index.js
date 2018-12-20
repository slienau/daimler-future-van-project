import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Container, Content, Text, List, Separator} from 'native-base'
import MainViewHeader from '../../components/ViewHeaders/MainViewHeader'
import {fetchOrders} from '../../ducks/orders'
import OrderItem from './OrderItem'
import OrderDetail from './OrderDetail'
import {createStackNavigator} from 'react-navigation'

class OrderList extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <MainViewHeader
          title="Orders"
          onMenuPress={() => navigation.openDrawer()}
        />
      ),
    }
  }

  state = {
    loading: false,
    error: false,
  }

  componentDidMount() {
    this.fetchOrderData()
  }

  async fetchOrderData() {
    this.setState({
      loading: true,
      error: false,
    })

    try {
      await this.props.onFetchOrders()
    } catch (error) {
      alert('Something went wrong while fetching order data')
      console.log(error)
      this.setState({
        error: true,
      })
    }

    this.setState({
      loading: false,
    })
  }

  render() {
    let activeOrderItem = null
    if (!this.props.activeOrder) {
      activeOrderItem = <Text>There is no active order at the moment.</Text>
    } else {
      activeOrderItem = <Text>TODO: show active order</Text>
    }
    return (
      <Container>
        <Content>
          <Separator bordered>
            <Text>ACTIVE ORDER</Text>
          </Separator>
          {activeOrderItem}
          <Separator bordered>
            <Text>PAST ORDERS</Text>
          </Separator>
          <List
            dataArray={this.props.pastOrders}
            renderRow={item => (
              <OrderItem
                key={item._id}
                order={item}
                onItemPress={() =>
                  this.props.navigation.navigate('OrderDetail', {
                    order: item,
                  })
                }
              />
            )}
          />
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
    pastOrders: state.orders.pastOrders,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(fetchOrders()),
  }
}

OrderList.propTypes = {
  activeOrder: PropTypes.object,
  onFetchOrders: PropTypes.func,
  pastOrders: PropTypes.array,
}

const OrderListScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList)

const Orders = createStackNavigator(
  {
    OrderList: {
      screen: OrderListScreen,
    },
    OrderDetail: {
      screen: OrderDetail,
    },
  },
  {
    initialRouteName: 'OrderList',
  }
)

export default Orders
