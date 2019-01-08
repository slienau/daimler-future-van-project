import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import MapMarker from '../../../components/MapMarker'

const VirtualBusStops = props => {
  if (!props.routes || !props.routes.length) return null
  return [
    <MapMarker
      key={0}
      location={_.get(props.routes[0], 'startStation.location')}
      title={'Start station'}
      image="vbs"
    />,
    <MapMarker
      key={1}
      location={_.get(props.routes[0], 'endStation.location')}
      title={'End station'}
      image="vbs"
    />,
  ]
}

VirtualBusStops.propTypes = {
  routes: PropTypes.array,
}

export default VirtualBusStops
