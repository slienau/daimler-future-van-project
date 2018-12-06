import React from 'react'
import {Marker} from 'react-native-maps'
import PropTypes from 'prop-types'

const VanMarker = props => {
  return (
    <Marker
      coordinate={props.location}
      title="DaimlerVan"
      image={require('./assets/marker.png')}
    />
  )
}

VanMarker.propTypes = {
  location: PropTypes.object,
}

export default VanMarker
