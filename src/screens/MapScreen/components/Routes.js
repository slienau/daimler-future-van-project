import React from 'react'
import _ from 'lodash'
import MapEncodedPolyline from './MapEncodedPolyline'
import {Polyline} from 'react-native-maps'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {OrderState} from '../../../ducks/map'

const Routes = props => {
  if (!props.routeInfo.toStartRoute || !props.routeInfo.toDestinationRoute)
    return null
  const coordinates = [_.get(props.routeInfo, 'vanStartVBS.location')].concat(
    props.orderState === OrderState.VAN_RIDE
      ? _.map(_.get(props.activeOrderStatus, 'nextStops', []), 'location')
      : _.get(props.routeInfo, 'vanEndVBS.location')
  )

  return (
    <>
      {![OrderState.VAN_RIDE, OrderState.EXIT_VAN].includes(
        props.orderState
      ) && (
        <MapEncodedPolyline
          points={_.get(
            props.routeInfo,
            'toStartRoute.routes.0.overview_polyline.points'
          )}
          strokeWidth={3}
          strokeColor="red"
        />
      )}
      {![OrderState.EXIT_VAN].includes(props.orderState) && (
        <Polyline
          key={3}
          strokeWidth={3}
          strokeColor="blue"
          coordinates={coordinates}
        />
      )}
      <MapEncodedPolyline
        points={_.get(
          props.routeInfo,
          'toDestinationRoute.routes.0.overview_polyline.points'
        )}
        strokeWidth={3}
        strokeColor="red"
      />
    </>
  )
}

Routes.propTypes = {
  activeOrderStatus: PropTypes.object,
  orderState: PropTypes.string,
  routeInfo: PropTypes.object,
}

export default connect(state => ({
  routeInfo: state.map.routeInfo,
  orderState: state.map.orderState,
  activeOrderStatus: state.orders.activeOrderStatus,
}))(Routes)
