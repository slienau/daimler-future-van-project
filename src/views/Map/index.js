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
import {createStackNavigator, createAppContainer} from 'react-navigation'
import SearchView from './SearchField'
import {connect} from 'react-redux'
import * as act from '../../ducks/map'

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

const GOOGLE_MAPS_APIKEY = 'AIzaSyDVR2sWwYcOY0gmCxXy2EjXOnaMW6VvELM'

const Map = props => {
  let userLocationMarker = null
  let destinationMarker = null
  let routing = null

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

  // called whenever we return to the map view from the SearchField view (from the StackNavigator)
  props.navigation.addListener('didFocus', payload => {
    console.log('FOCUSSED', payload)
    console.log(
      props.map.searchResults,
      props.map.searchResults.map(item => item.isNew)
    )
    props.setLastSearchResultToOld()
  })

  return (
    <StyledView>
      <StyledMapView
        region={{
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
      </StyledMapView>
    </StyledView>
  )
}

Map.propTypes = {
  destinationMarker: PropTypes.string,
  map: PropTypes.object,
  routing: PropTypes.string,
  setLastSearchResultToOld: PropTypes.func,
  userLocationMarker: PropTypes.string,
}

const mapStateToProps = state => {
  return {
    map: state.map,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLastSearchResultToOld: () => {
      dispatch({type: act.SET_LAST_SEARCH_RESULT_TO_OLD})
    },
  }
}

// we create a stack navigator with the map as default and the search view, so that it can be placed on top
// of the map to get the start and destination
const MapNavigator = createStackNavigator(
  {
    Map: {
      screen: connect(
        mapStateToProps,
        mapDispatchToProps
      )(Map),
      navigationOptions: () => ({header: null}),
    },
    Search: {
      screen: SearchView,
    },
  },
  {
    initialRouteName: 'Map',
  }
)

export default createAppContainer(MapNavigator)
