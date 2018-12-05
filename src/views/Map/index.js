import React from 'react'
import styled from 'styled-components/native'
import MapView, {Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import PropTypes from 'prop-types'
import VirtualBusStopMarker from './VirtualBusStopMarker/VirtualBusStopMarker'
import {virtualBusStops} from './virtualBusStops'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const StyledMapView = styled(MapView)`
  position: absolute;
  top: 10;
  left: 10;
  right: 10;
  bottom: 10;
`
// Some static cords
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

const GOOGLE_MAPS_APIKEY = 'xxx'

const Map = props => {
  let userLocationMarker = null
  let destinationMarker = null
  let routing = null

  // When state != null --> set static marker for start location
  // to-do: pass dynamic input
  if (props.userLocationMarker) {
    userLocationMarker = (
      <Marker
        coordinate={{latitude: 52.509663, longitude: 13.376481}}
        title={'Potsdammer Platz'}
        description={'Hier kann man die Umgebung Beschreiben.'}
      />
    )
  }

  // When state != null --> set static marker for destination
  // to-do: pass dynamic input
  if (props.destinationMarker) {
    destinationMarker = (
      <Marker
        coordinate={{latitude: 52.507334, longitude: 13.332367}}
        title={'Potsdammer Platz'}
        description={'Hier kann man die Umgebung Beschreiben.'}
      />
    )
  }

  // When state != null --> set static route
  // to-do: pass dynamic input
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

  // hard coded virtual bus stops
  const virtualBusStopMarkers = virtualBusStops.map(virtualBusStop => {
    return (
      <VirtualBusStopMarker
        key={virtualBusStop.id}
        location={virtualBusStop.location}
      />
    )
  })

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
        {virtualBusStopMarkers}
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
