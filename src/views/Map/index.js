import React from 'react'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import PropTypes from 'prop-types'
import VirtualBusStopMarker from './VirtualBusStopMarker'
import VanMarker from './VanMarker'
import PersonMarker from './PersonMarker'
import DestinationMarker from './DestinationMarker'
import {virtualBusStops, vanPositions} from './markerPositions'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const StyledMapView = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

const GOOGLE_MAPS_APIKEY = 'AIzaSyBf-YuW1Wgm-ZxzKq9tkqlQH7fO39ADutA'

const Map = props => {
  let userLocationMarker = null
  let destinationMarker = null
  let routing = null
  let currentLocationMarker = null

  // When state != null --> set static marker for start location
  // to-do: pass dynamic input
  if (props.userLocationMarker) {
    userLocationMarker = (
      <PersonMarker
        coordinate={coordinates[0]}
        title={'Potsdammer Platz'}
        description={'Hier kann man die Umgebung Beschreiben.'}
      />
    )
  }

  if (props.current_latitude && props.current_longitude) {
    currentLocationMarker = (
      <PersonMarker
        coordinate={{
          latitude: props.current_latitude,
          longitude: props.current_longitude,
        }}
        title={'Current Position'}
        description={''}
      />
    )
  }

  // When state != null --> set static marker for destination
  // to-do: pass dynamic input
  if (props.destinationMarker) {
    destinationMarker = (
      <DestinationMarker
        coordinate={coordinates[1]}
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

  // hard coded virtual bus stops and vans
  const virtualBusStopMarkers = virtualBusStops.map(virtualBusStop => {
    return (
      <VirtualBusStopMarker
        key={virtualBusStop.id}
        location={virtualBusStop.location}
      />
    )
  })

  const vanMarkers = vanPositions.map(van => {
    return <VanMarker key={van.id} location={van.location} />
  })

  return (
    <StyledView>
      <StyledMapView
        initialRegion={{
          latitude: 52.509663,
          longitude: 13.376481,
          latitudeDelta: 0.01,
          longitudeDelta: 0.1,
        }}>
        {userLocationMarker}
        {destinationMarker}
        {routing}
        {virtualBusStopMarkers}
        {vanMarkers}
        {currentLocationMarker}
      </StyledMapView>
    </StyledView>
  )
}

Map.propTypes = {
  current_latitude: PropTypes.float,
  current_longitude: PropTypes.float,
  destinationMarker: PropTypes.string,
  routing: PropTypes.string,
  userLocationMarker: PropTypes.string,
}
export default Map
