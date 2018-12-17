import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import MapEncodedPolyline from '../../components/MapEncodedPolyline'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Marker from './Marker'
import {virtualBusStops, vanPositions} from './markerPositions'
import {createStackNavigator} from 'react-navigation'
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
const StyledPlaceOrderButton = styled(Button)`
  position: absolute;
  right: 10%;
  left: 50%;
  bottom: 3%;
`
const StyledCancelOrderButton = styled(Button)`
  position: absolute;
  left: 15%;
  right: 70%;
  bottom: 3%;
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

const StyledFab = styled(Fab)`
  margin-bottom: 55;
`
// Some static cords
// const coordinates = [
//   {
//     latitude: 52.509663,
//     longitude: 13.376481,
//   },
//   {
//     latitude: 52.507334,
//     longitude: 13.332367,
//   },
// ]

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      marginBottom: 1,
      userLocationMarker: null,
      cancelOrderButton: null,
      destinationMarker: null,
      placeOrderButton: null,
      destinationButton: 'destination',
      routing: null,
      error: null,
      marker: {
        region: {
          latitude: 52.509663,
          longitude: 13.376481,
          latitudeDelta: 0.1,
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
            <Marker
              location={{
                latitude: lastSearchResult.geometry.location.lat,
                longitude: lastSearchResult.geometry.location.lng,
              }}
              title={lastSearchResult.name}
              description={lastSearchResult.vicinity}
              image="destination"
            />
          )
          this.cancelOrderButton = (
            <StyledCancelOrderButton
              rounded
              iconCenter
              light
              onPress={() =>
                Alert.alert(
                  'Cancel Order',
                  'Are you sure to cancel your order?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => console.log('Yes Pressed'),
                      style: 'cancel',
                    },
                    {text: 'No', onPress: () => console.log('No Pressed')},
                  ],
                  {cancelable: false}
                )
              }>
              <Icon name="md-arrow-dropleft-circle" />
            </StyledCancelOrderButton>
          )
          this.placeOrderButton = (
            <StyledPlaceOrderButton
              rounded
              iconRight
              light
              onPress={() => alert('TODO - Place Order')}>
              <Text>Place Order </Text>
              <Icon name="arrow-forward" />
            </StyledPlaceOrderButton>
          )
          this.destinationButton = null
          this.setState({
            placeOrderButton: 'placeOrder',
            destinationButton: null,
            marker: {
              region: {
                latitude: lastSearchResult.geometry.location.lat,
                longitude: lastSearchResult.geometry.location.lng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.01,
              },
              // routing: 'schokokeks',
            },
          })
          this.props.setLastSearchResultToOld()
        }
      }
    })

    // hard coded virtual bus stops and vans
    this.virtualBusStopMarkers = virtualBusStops.map(virtualBusStop => {
      return (
        <Marker
          key={virtualBusStop.id}
          location={virtualBusStop.location}
          image="vbs"
        />
      )
    })

    this.vanMarkers = vanPositions.map(van => {
      return <Marker key={van.id} location={van.location} image="van" />
    })
  }

  // shows current position on the map
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
          marker: {
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.001,
            },
            error: null,
          },
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000}
    )
  }

  // from: https://github.com/react-native-community/react-native-maps/issues/505#issuecomment-243423775
  // expects a list of two coordinate objects and returns a region as specified by the react-native-maps components
  getRegionForCoordinates(points) {
    const minX = _.min(_.map(points, 'latitude'))
    const maxX = _.max(_.map(points, 'latitude'))
    const minY = _.min(_.map(points, 'longitude'))
    const maxY = _.max(_.map(points, 'longitude'))

    return {
      latitude: (minX + maxX) / 2,
      longitude: (minY + maxY) / 2,
      latitudeDelta: (maxX - minX) * 1.5,
      longitudeDelta: (maxY - minY) * 1.5,
    }
  }

  showCurrentLocation() {
    this.setState({
      marker: {
        userLocationMarker: 'null',
      },
    })
    this.userLocationMarker = (
      <Marker
        location={{
          latitude: this.state.currentLatitude,
          longitude: this.state.currentLongitude,
        }}
        title={'My Current Location'}
        image="person"
      />
    )
  }

  _onMapReady = () => {
    this.setState({marginBottom: 0})
    this.destinationButton = (
      <StyledButton
        rounded
        iconRight
        light
        onPress={() => this.props.navigation.navigate('Search')}>
        <Text>destination </Text>
        <Icon name="arrow-forward" />
      </StyledButton>
    )
  }

  render() {
    return (
      <Container>
        <StyledMapView
          marginBottom={this.state.marginBottom}
          region={this.state.marker.region}
          showsMyLocationButton={false}
          showsUserLocation
          followsUserLocation
          onMapReady={this._onMapReady}>
          {this.userLocationMarker}
          {this.destinationMarker}
          <MapEncodedPolyline
            points="_|l_Is}ppA{F}EkHgG}AsA}AmAOYk@o@eF_Gm@k@YQsAq@oB_AqCqA]MqAk@kB}@UUo@sAy@wBIcAIeCO}FM{CYkHMoE?ICMEi@WDs@Ha@Da@AkKuAs@IcACiA@}AOsAQoBUQBOAeCO_@CSBMBOJOXMd@GNOTKJKBS@MG[WQYOQOKKCWBy@R_A\k@RDZlBw@`@Mh@INFLPVh@RT"
            strokeWidth={3}
            strokeColor="red"
          />
          {/* {this.virtualBusStopMarkers}
          {this.vanMarkers} */}
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
        <StyledFab
          active={this.state.active}
          direction="up"
          position="bottomRight"
          onPress={() => this.showCurrentLocation()}>
          <Icon name="locate" />
        </StyledFab>

        {/* button for searching route */}
        {/* this.renderBottomButtons() */}
        {this.destinationButton}
        {this.cancelOrderButton}
        {this.placeOrderButton}
      </Container>
    )
  }
}

Map.propTypes = {
  map: PropTypes.object,
  setLastSearchResultToOld: PropTypes.func,
}

const MapScreen = connect(
  state => ({
    map: state.map,
  }),
  dispatch => ({
    setLastSearchResultToOld: () => {
      dispatch({type: act.SET_LAST_SEARCH_RESULT_TO_OLD})
    },
  })
)(Map)

// we create a stack navigator with the map as default and the search view, so that it can be placed on top
// of the map to get the start and destination
export default createStackNavigator(
  {
    Map: {
      screen: MapScreen,
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
