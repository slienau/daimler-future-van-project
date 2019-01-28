import React from 'react'
import {Marker} from 'react-native-maps'
import PropTypes from 'prop-types'

const images = {
  destination: require('./assets/destination.png'),
  person: require('./assets/person.png'),
  van: require('./assets/van1.png'),
  vbs: require('./assets/vbs.png'),
}

const MapMarker = props => {
  return (
    <Marker
      coordinate={props.location}
      title={props.title}
      description={props.description}
      image={images[props.image]}
    />
  )
}

MapMarker.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  location: PropTypes.object,
  title: PropTypes.string,
}

export default MapMarker
