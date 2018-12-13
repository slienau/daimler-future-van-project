import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Container, Content, Text, List, Separator} from 'native-base'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import ViewHeader from '../../components/ViewHeader'
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
    this.props.onFetchOrders()
  }

  render() {
    console.log(this.props.activeOrder)
    console.log(this.props.pastOrders)
    const activeOrderItem = <Text>There is no active order at the moment.</Text> // TODO
    return (
      <StyledView>
        <Container>
          <ViewHeader
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
            <List dataArray={pastOrdersForTesting} renderRow={OrderItem} />
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
  activeOrder: PropTypes.obj,
  onFetchOrders: PropTypes.func,
  pastOrders: PropTypes.array,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)

const pastOrdersForTesting = [
  {
    id: '13cf81ee-8898-4b7a-a96e-8b5f675deb3c',
    accountId: '0e8cedd0-ad98-11e6-bf2e-47644ada7c0f',
    orderTime: '2018-02-23T18:25:43.511Z',
    active: false,
    canceled: false,
    virtualBusStopStart: {
      id: '7416550b-d47d-4947-b7ec-423c9fade07f',
      accessible: true,
      location: {
        latitude: 52.515598,
        longitude: 13.32686,
      },
    },
    virtualBusStopEnd: {
      id: '76d7fb2f-c264-45a0-ad65-b21c5cf4b532',
      accessible: true,
      location: {
        latitude: 52.512974,
        longitude: 13.329145,
      },
    },
    startTime: '2018-02-23T18:30:25.000Z',
    endTime: '2018-02-23T18:45:48.000Z',
  },
  {
    id: '32c6281a-b05c-4cb7-8926-739842c0be86',
    accountId: '0e8cedd0-ad98-11e6-bf2e-47644ada7c0f',
    orderTime: '2018-03-23T18:25:43.511Z',
    active: false,
    canceled: false,
    virtualBusStopStart: {
      id: '7416550b-d47d-4947-b7ec-423c9fade07f',
      accessible: true,
      location: {
        latitude: 52.515598,
        longitude: 13.32686,
      },
    },
    virtualBusStopEnd: {
      id: '76d7fb2f-c264-45a0-ad65-b21c5cf4b532',
      accessible: true,
      location: {
        latitude: 52.512974,
        longitude: 13.329145,
      },
    },
    startTime: '2018-03-23T18:30:25.000Z',
    endTime: '2018-03-23T18:45:48.000Z',
  },
]
