import React from 'react'
import {Marker as MapsMarker} from 'react-native-maps'
import PropTypes from 'prop-types'

const images = {
  destination: require('./assets/destination.png'),
  person: require('./assets/person.png'),
  van: require('./assets/van.png'),
  vbs: require('./assets/vbs.png'),
}

const Marker = props => {
  return (
    <MapsMarker
      coordinate={props.location}
      title={props.title}
      description={props.description}
      image={images[props.image]}
    />
  )
}

Marker.propTypes = {
  description: PropTypes.string,
  image: PropTypes.string,
  location: PropTypes.object,
  title: PropTypes.string,
}

export default Marker
