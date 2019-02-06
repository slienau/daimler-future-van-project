import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Container, Content, Text, List, Separator, View} from 'native-base'
import {fetchOrders} from '../../ducks/orders'
import PastOrdersListItem from './components/PastOrdersListItem'

class PastOrdersScreen extends Component {
  state = {
    loading: false,
    error: false,
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.fetchOrderData()
    })
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
