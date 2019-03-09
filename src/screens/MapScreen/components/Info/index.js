import React from 'react'
import PropTypes from 'prop-types'
import {OrderState} from '../../../../ducks/map'
import {connect} from 'react-redux'
import OrderInfo from './OrderInfo'
import RouteInfo from './RouteInfo'

const Info = props => {
  switch (props.orderState) {
    case OrderState.ROUTE_SEARCHED:
      return <RouteInfo />
    case OrderState.ROUTE_ORDERED:
      return <OrderInfo onEnterVanPress={props.onEnterVanPress} />
    case OrderState.EXIT_VAN:
      return <OrderInfo />

    default:
      return null
  }
}

Info.propTypes = {
  onEnterVanPress: PropTypes.func,
  orderState: PropTypes.string,
}

export default connect(state => ({
  orderState: state.map.orderState,
}))(Info)
