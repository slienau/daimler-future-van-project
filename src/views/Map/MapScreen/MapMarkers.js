import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import MapMarker from '../../../components/MapMarker'
import {connect} from 'react-redux'
import {MapState} from '../../../ducks/map'

const MapMarkers = props => {
  return (
    <>
      {props.routes && props.routes.length && (
        <>
          <MapMarker
            location={_.get(props.routes[0], 'vanStartVBS.location')}
            title={'Start station'}
            image="vbs"
          />
          <MapMarker
            location={_.get(props.routes[0], 'vanEndVBS.location')}
            title={'End station'}
            image="vbs"
          />
        </>
      )}
      {props.userStartLocation && (
        <MapMarker
          location={props.userStartLocation.location}
          title={'My Current Location'}
          image="person"
        />
      )}
      {props.userDestinationLocation && (
        <MapMarker image="destination" {...props.userDestinationLocation} />
      )}
      {[MapState.INIT, MapState.SEARCH_ROUTES].includes(props.mapState) &&
        props.vans &&
        props.vans.map((v, i) => <MapMarker key={i} image="van" {...v} />)}
      {[MapState.ROUTE_ORDERED, MapState.VAN_RIDE].includes(props.mapState) &&
        props.activeOrderStatus && (
          <MapMarker
            image="van"
            location={props.activeOrderStatus.vanLocation}
          />
        )}
    </>
  )
}

MapMarkers.propTypes = {
  activeOrderStatus: PropTypes.object,
  mapState: PropTypes.string,
  routes: PropTypes.array,
  userDestinationLocation: PropTypes.object,
  userStartLocation: PropTypes.object,
  vans: PropTypes.array,
}

export default connect(state => ({
  activeOrderStatus: state.orders.activeOrderStatus,
  userDestinationLocation: state.map.userDestinationLocation,
  userStartLocation: state.map.userStartLocation,
  mapState: state.map.mapState,
  routes: state.map.routes,
  vans: state.map.vans,
}))(MapMarkers)
