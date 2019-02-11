import React from 'react'
import _ from 'lodash'
import MapEncodedPolyline from '../../components/MapEncodedPolyline'
import {Polyline} from 'react-native-maps'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {MapState} from '../../ducks/map'

const Routes = props => {
  if (!props.routeInfo.toStartRoute || !props.routeInfo.toDestinationRoute)
    return null
  const coordinates = [_.get(props.routeInfo, 'vanStartVBS.location')].concat(
    props.mapState === MapState.VAN_RIDE
      ? _.map(_.get(props.activeOrderStatus, 'nextStops', []), 'location')
      : _.get(props.routeInfo, 'vanEndVBS.location')
  )

  return (
    <>
      {props.mapState !== MapState.VAN_RIDE && (
        <MapEncodedPolyline
          points={_.get(
            props.routeInfo,
            'toStartRoute.routes.0.overview_polyline.points'
          )}
          strokeWidth={3}
          strokeColor="red"
        />
      )}
      <Polyline
        key={3}
        strokeWidth={3}
        strokeColor="blue"
        coordinates={coordinates}
      />
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
  mapState: PropTypes.string,
  routeInfo: PropTypes.object,
}

export default connect(state => ({
  routeInfo: state.map.routeInfo,
  mapState: state.map.mapState,
  activeOrderStatus: state.orders.activeOrderStatus,
}))(Routes)
