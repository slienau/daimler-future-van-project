import React from 'react'
import {Marker} from 'react-native-maps'
import PropTypes from 'prop-types'

const VirtualBusStopMarker = props => {
  return (
    <Marker
      coordinate={props.location}
      title="Virtual Bus Stop"
      image={require('./assets/marker_128.png')}
    />
  )
}

VirtualBusStopMarker.propTypes = {
  location: PropTypes.object,
}

export default VirtualBusStopMarker
