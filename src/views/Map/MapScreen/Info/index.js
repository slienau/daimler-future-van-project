import React from 'react'
import PropTypes from 'prop-types'
import {MapState} from '../../../../ducks/map'
import {connect} from 'react-redux'
import OrderInfo from './OrderInfo'
import RouteInfo from './RouteInfo'

const Info = props => {
  switch (props.mapState) {
    case MapState.ROUTE_SEARCHED:
      return <RouteInfo fitToCoordinates={props.fitToCoordinates} />
    case MapState.ROUTE_ORDERED:
      return <OrderInfo fitToCoordinates={props.fitToCoordinates} />

    default:
      return null
  }
}

const mapStateToProps = state => {
  return {
    mapState: state.map.mapState,
  }
}

Info.propTypes = {
  fitToCoordinates: PropTypes.func,
  mapState: PropTypes.string,
}

export default connect(
  mapStateToProps,
  null
)(Info)
