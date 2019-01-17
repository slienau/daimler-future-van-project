import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Container, Content, Text, List, Separator} from 'native-base'
import {fetchOrders} from '../../ducks/orders'
import OrderListItem from './OrderListItem'

class OrderList extends Component {
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
      activeOrderItem = (
        <OrderListItem
          key={this.props.activeOrder.id}
          order={this.props.activeOrder}
        />
      )
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
              <OrderListItem
                key={item.id}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList)
