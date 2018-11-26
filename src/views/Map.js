import React from 'react'
import styled from 'styled-components/native'
import MapView, {Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import PropTypes from 'prop-types'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgb(46, 47, 49);
`

const StyledMapView = styled(MapView)`
  position: absolute;
  top: 10;
  left: 10;
  right: 10;
  bottom: 10;
`

const coordinates = [
  {
    latitude: 52.509663,
    longitude: 13.376481,
  },
  {
    latitude: 52.507334,
    longitude: 13.332367,
  },
]

const GOOGLE_MAPS_APIKEY = 'AIzaSyBkUCcXzPMgV7oWzMWTxDDjjYEP4jUSSoU'

const Map = props => {
  let userLocationMarker = null
  let destinationMarker = null
  let routing = null

  if (props.userLocationMarker) {
    userLocationMarker = (
      <Marker
        coordinate={{latitude: 52.509663, longitude: 13.376481}}
        title={'Potsdammer Platz'}
        description={'Hier kann man die Umgebung Beschreiben.'}
      />
    )
  }

  if (props.destinationMarker) {
    destinationMarker = (
      <Marker
        coordinate={{latitude: 52.507334, longitude: 13.332367}}
        title={'Potsdammer Platz'}
        description={'Hier kann man die Umgebung Beschreiben.'}
      />
    )
  }

  if (props.routing) {
    routing = (
      <MapViewDirections
        origin={coordinates[0]}
        destination={coordinates[1]}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="hotpink"
        mode="driving"
      />
    )
  }

  return (
    <StyledView>
      <StyledMapView
        initialRegion={{
          latitude: 52.509663,
          longitude: 13.376481,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {userLocationMarker}
        {destinationMarker}
        {routing}
      </StyledMapView>
    </StyledView>
  )
}

Map.propTypes = {
  destinationMarker: PropTypes.string,
  routing: PropTypes.string,
  userLocationMarker: PropTypes.string,
}
export default Map
