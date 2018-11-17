import React from 'react'
import styled from 'styled-components/native'
import MapView, {Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

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

const Map = () => {
  return (
    <StyledView>
      <StyledMapView
        initialRegion={{
          latitude: 52.509663,
          longitude: 13.376481,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        <Marker
          coordinate={{latitude: 52.509663, longitude: 13.376481}}
          title={'Potsdammer Platz'}
          description={'Hier kann man die Umgebung Beschreiben.'}
        />
        <Marker
          coordinate={{latitude: 52.507334, longitude: 13.332367}}
          title={'Zoologischer Garten'}
          description={'Hier kann man die Umgebung Beschreiben.'}
        />

        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="hotpink"
          mode="driving"
        />
        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[1]}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="gray"
          mode="transit"
        />
      </StyledMapView>
    </StyledView>
  )
}
export default Map
