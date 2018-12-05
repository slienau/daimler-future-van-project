import React from 'react'
import {Marker} from 'react-native-maps'
import PropTypes from 'prop-types'

const PersonMarker = props => {
  return (
    <Marker
      coordinate={props.coordinate}
      title={props.title}
      description={props.description}
      image={require('./assets/marker.png')}
    />
  )
}

PersonMarker.propTypes = {
  coordinate: PropTypes.object,
  description: PropTypes.string,
  title: PropTypes.string,
}

export default PersonMarker
