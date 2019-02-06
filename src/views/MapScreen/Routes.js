import React from 'react'
import _ from 'lodash'
import MapEncodedPolyline from '../../components/MapEncodedPolyline'
import {Polyline} from 'react-native-maps'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {MapState} from '../../ducks/map'

const Routes = props => {
  if (!props.route) return null
  const coordinates = [_.get(props.route, 'vanStartVBS.location')].concat(
    props.mapState === MapState.VAN_RIDE
      ? _.map(_.get(props.activeOrderStatus, 'nextStops', []), 'location')
      : _.get(props.route, 'vanEndVBS.location')
  )

  return (
    <>
      {props.mapState !== MapState.VAN_RIDE && (
        <MapEncodedPolyline
          points={_.get(
            props.route,
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
          props.route,
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
  route: PropTypes.object,
}

export default connect(state => ({
  route: _.get(state.map, 'routes.0'),
  mapState: state.map.mapState,
  activeOrderStatus: state.orders.activeOrderStatus,
}))(Routes)
