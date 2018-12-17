import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Container, Content, Text, List, Separator} from 'native-base'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import MainViewHeader from '../../components/ViewHeaders/MainViewHeader'
import {fetchOrders} from '../../ducks/orders'
import OrderItem from './OrderItem'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

class Orders extends Component {
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
      <StyledView>
        <Container>
          <MainViewHeader
            title="Orders"
            onMenuPress={() => this.props.navigation.openDrawer()}
          />
          <Content>
            <Separator bordered>
              <Text>ACTIVE ORDER</Text>
            </Separator>
            {activeOrderItem}
            <Separator bordered>
              <Text>PAST ORDERS</Text>
            </Separator>
            <List dataArray={this.props.pastOrders} renderRow={OrderItem} />
          </Content>
        </Container>
      </StyledView>
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

Orders.propTypes = {
  activeOrder: PropTypes.object,
  onFetchOrders: PropTypes.func,
  pastOrders: PropTypes.array,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
