import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import MapMarker from '../../../components/MapMarker'
import {connect} from 'react-redux'
import {OrderState} from '../../../ducks/map'

const MapMarkers = props => {
  return (
    <>
      {props.routeInfo &&
        props.routeInfo.vanStartVBS &&
        props.routeInfo.vanEndVBS && (
          <>
            <MapMarker
              location={_.get(props.routeInfo, 'vanStartVBS.location')}
              title={'Start station'}
              image="vbs"
            />
            <MapMarker
              location={_.get(props.routeInfo, 'vanEndVBS.location')}
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
      {[OrderState.INIT, OrderState.SEARCH_ROUTES].includes(props.orderState) &&
        props.vans &&
        props.vans.map((v, i) => <MapMarker key={i} image="van" {...v} />)}
      {[OrderState.ROUTE_ORDERED, OrderState.VAN_RIDE].includes(
        props.orderState
      ) &&
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
  orderState: PropTypes.string,
  routeInfo: PropTypes.object,
  userDestinationLocation: PropTypes.object,
  userStartLocation: PropTypes.object,
  vans: PropTypes.array,
}

export default connect(state => ({
  activeOrderStatus: state.orders.activeOrderStatus,
  userDestinationLocation: state.map.userDestinationLocation,
  userStartLocation: state.map.userStartLocation,
  orderState: state.map.orderState,
  routeInfo: state.map.routeInfo,
  vans: state.map.vans,
}))(MapMarkers)
