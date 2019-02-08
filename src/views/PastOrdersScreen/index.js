import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {
  Container,
  Content,
  Text,
  List,
  Separator,
  View,
  Toast,
} from 'native-base'
import {fetchOrders} from '../../ducks/orders'
import PastOrdersListItem from './components/PastOrdersListItem'
import {defaultDangerToast} from '../../lib/toasts'

class PastOrdersScreen extends Component {
  componentDidMount() {
    this.fetchOrderData()
  }

  async fetchOrderData() {
    try {
      await this.props.onFetchOrders()
    } catch (error) {
      Toast.show(
        defaultDangerToast("Couldn't get order history. " + error.message)
      )
    }
  }

  render() {
    const ordersByMonth = {}
    this.props.pastOrders
      .sort((order1, order2) => order2.orderTime - order1.orderTime)
      .forEach(order => {
        const month = order.orderTime.format('MMMM YYYY')
        if (month in ordersByMonth) ordersByMonth[month].push(order)
        else ordersByMonth[month] = [order]
      })
    return (
      <Container>
        <Content>
          {Object.keys(ordersByMonth).map(month => {
            return (
              <View key={month}>
                <Separator bordered>
                  <Text>{month}</Text>
                </Separator>
                <List
                  dataArray={ordersByMonth[month]}
                  renderRow={item => (
                    <PastOrdersListItem
                      key={item.id}
                      order={item}
                      onItemPress={() =>
                        this.props.navigation.push('PastOrderDetails', {
                          order: item,
                        })
                      }
                    />
                  )}
                />
              </View>
            )
          })}
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    pastOrders: state.orders.pastOrders,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(fetchOrders()),
  }
}

PastOrdersScreen.propTypes = {
  onFetchOrders: PropTypes.func,
  pastOrders: PropTypes.array,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PastOrdersScreen)
