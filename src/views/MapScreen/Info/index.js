import React from 'react'
import PropTypes from 'prop-types'
import {MapState} from '../../../ducks/map'
import {connect} from 'react-redux'
import OrderInfo from './OrderInfo'
import RouteInfo from './RouteInfo'

const Info = props => {
  switch (props.mapState) {
    case MapState.ROUTE_SEARCHED:
      return <RouteInfo />
    case MapState.ROUTE_ORDERED:
      return <OrderInfo onEnterVanPress={props.onEnterVanPress} />
    case MapState.EXIT_VAN:
      return <OrderInfo toMapScreen={props.toMapScreen} />

    default:
      return null
  }
}

Info.propTypes = {
  mapState: PropTypes.string,
  onEnterVanPress: PropTypes.func,
  toMapScreen: PropTypes.func,
}

export default connect(state => ({
  mapState: state.map.mapState,
}))(Info)
