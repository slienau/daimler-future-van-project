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
import {Container, Button, Text, Icon, Fab} from 'native-base'

/* const StyledContainer = styled(Container)`
  flex: 1;
  align-items: center;
  justify-content: center;
` */

const StyledMapView = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-bottom: ${props => props.marginBottom};
`

// For bottom button
const StyledButton = styled(Button)`
  position: absolute;
  left: 30%;
  right: 30%;
  bottom: 4%;
`

// For bottom button
/* const StyledFab = styled(Fab)`
  margin-bottom: 55px;
` */
// For bottom button
const StyledMenu = styled(Fab)`
  margin-top: 5px;
  background-color: gray;
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

const GOOGLE_MAPS_APIKEY = 'AIzaSyBLjSLCSdnDP2K1muAvuiREJmMdY5ahPgk'

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      marginBottom: 1,
      userLocationMarker: null,
      destinationMarker: null,
      routing: null,
      error: null,
      marker: {
        region: {
          latitude: 52.509663,
          longitude: 13.376481,
          latitudeDelta: 0.01,
          longitudeDelta: 0.1,
        },
      },
    }

    // called whenever we return to the map view from the SearchField view (from the StackNavigator)
    props.navigation.addListener('didFocus', payload => {
      console.log('FOCUSSED', payload)
      console.log(
        this.props.map.searchResults,
        this.props.map.searchResults.map(item => item.isNew)
      )
      const len = this.props.map.searchResults.length
      console.log('props:', this.props)
      if (len > 0) {
        const lastSearchResult = this.props.map.searchResults[len - 1]
        if (lastSearchResult.isNew) {
          this.destinationMarker = (
            <DestinationMarker
              coordinate={{
                latitude: lastSearchResult.geometry.location.lat,
                longitude: lastSearchResult.geometry.location.lng,
              }}
              title={lastSearchResult.name}
              description={lastSearchResult.vicinity}
            />
          )
          this.setState({
            marker: {
              region: {
                latitude: lastSearchResult.geometry.location.lat,
                longitude: lastSearchResult.geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.1,
              },
            },
          })
          this.props.setLastSearchResultToOld()
        }
      }
    })

    /* let userLocationMarker = null
  let destinationMarker = null
  let routing = null
  let currentLocationMarker = null */

    // When state != null --> set static marker for start location
    // to-do: pass dynamic input
    if (props.userLocationMarker) {
      this.userLocationMarker = (
        <PersonMarker
          coordinate={coordinates[0]}
          title={'Potsdammer Platz'}
          description={'Hier kann man die Umgebung Beschreiben.'}
        />
      )
    }

    if (props.currentLatitude && props.currentLongitude) {
      this.currentLocationMarker = (
        <PersonMarker
          coordinate={{
            latitude: props.currentLatitude,
            longitude: props.currentLongitude,
          }}
          title={'Current Position'}
          description={''}
        />
      )
    }

    // When state != null --> set static route
    // to-do: pass dynamic input
    if (props.routing) {
      this.routing = (
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
    this.virtualBusStopMarkers = virtualBusStops.map(virtualBusStop => {
      return (
        <VirtualBusStopMarker
          key={virtualBusStop.id}
          location={virtualBusStop.location}
        />
      )
    })

    this.vanMarkers = vanPositions.map(van => {
      return <VanMarker key={van.id} location={van.location} />
    })
  }

  // sets location for start and destination
  onSearchRoutes() {
    this.setState({
      marker: {
        userLocationMarker: 'nul',
        destinationMarker: 'keks',
        routing: 'schokokeks',
      },
    })
  }

  // shows current position on the map
  showCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          marker: {
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.1,
            },
            currentLatitude: position.coords.latitude,
            currentLongitude: position.coords.longitude,
            error: null,
          },
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000}
    )
  }

  _onMapReady = () => this.setState({marginBottom: 0})

  render() {
    return (
      <Container>
        <StyledMapView
          marginBottom={this.state.marginBottom}
          region={this.state.marker.region}
          showsMyLocationButton
          showsUserLocation
          followsUserLocation
          onMapReady={this._onMapReady}>
          {this.userLocationMarker}
          {this.destinationMarker}
          {this.routing}
          {this.virtualBusStopMarkers}
          {this.vanMarkers}
          {this.currentLocationMarker}
        </StyledMapView>
        <StyledMenu
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          position="topLeft"
          onPress={() => this.props.navigation.openDrawer()}>
          <Icon name="menu" />
        </StyledMenu>

        {/* Floating Button to show current location */}
        {/* <StyledFab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          position="bottomRight"
          onPress={() => this.showCurrentLocation()}>
          <Icon name="locate" />
        </StyledFab> */}

        {/* button for searching route */}
        <StyledButton
          rounded
          iconRight
          light
          onPress={() => this.props.navigation.navigate('Search')}>
          <Text>destination </Text>
          <Icon name="arrow-forward" />
        </StyledButton>
      </Container>
    )
  }
}

Map.propTypes = {
  currentLatitude: PropTypes.number,
  currentLongitude: PropTypes.number,
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
      navigationOptions: () => ({
        header: null,
        drawerIcon: () => <Icon name="map" />,
      }),
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
