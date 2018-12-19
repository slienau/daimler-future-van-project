import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import PropTypes from 'prop-types'
import Marker from './Marker'
import SearchForm from '../Map/SearchForm'
import BottomButtons from '../Map/BottomButtons'
// import {virtualBusStops, vanPositions} from './markerPositions'
import {createStackNavigator} from 'react-navigation'
import SearchView from './SearchField'
import {connect} from 'react-redux'
import * as act from '../../ducks/map'
import {Container, Icon, Fab} from 'native-base'

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
const StyledMenu = styled(Fab)`
  margin-top: 5px;
  background-color: gray;
`

const StyledFab = styled(Fab)`
  margin-bottom: 55;
`

const GOOGLE_MAPS_APIKEY = 'AIzaSyBf-YuW1Wgm-ZxzKq9tkqlQH7fO39ADutA'

const MapState = {
  INIT: 'INIT',
  SEARCH_ROUTES: 'SEARCH_ROUTES',
  ROUTE_SEARCHED: 'ROUTE_SEARCHED',
  ROUTE_ORDERED: 'ROUTE_ORDERED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
}

const ANIMATION_DUR = 1500

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.mapRef = null
    this.state = {
      mapState: MapState.INIT,
      marginBottom: 1,
      userLocationMarker: null,
      cancelOrderButton: null,
      destinationMarker: null,
      placeOrderButton: null,
      destinationButton: 'destination',
      routing: null,
      error: null,
      initialRegion: {
        latitude: 52.509663,
        longitude: 13.376481,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
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
      if (len > 0) {
        const lastSearchResult = this.props.map.searchResults[len - 1]
        if (lastSearchResult.isNew) {
          this.props.setLastSearchResultToOld()
          switch (this.state.mapState) {
            case MapState.INIT:
              this.setDestinationMarker(
                lastSearchResult.geometry.location,
                lastSearchResult.name,
                lastSearchResult.vicinity
              )
              this.setState({
                mapState: MapState.SEARCH_ROUTES,
              })
              this.mapRef.animateToRegion(
                {
                  latitude: lastSearchResult.geometry.location.latitude,
                  longitude: lastSearchResult.geometry.location.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                },
                ANIMATION_DUR
              )
              break
            case MapState.SEARCH_ROUTES:
              this.setUserLocationMarker(
                lastSearchResult.geometry.location,
                lastSearchResult.name,
                lastSearchResult.vicinity
              )
              this.setState({
                mapState: MapState.SEARCH_ROUTES, // stay in SEARCH_ROUTES
              })
              const coords = [
                this.userLocationMarker.props.location,
                this.destinationMarker.props.location,
              ]
              this.mapRef.fitToCoordinates(coords, {
                edgePadding: {top: 400, right: 100, left: 100, bottom: 350},
                animated: true,
              })
              break
          }
        }
      }
    })
  }

  showCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
        })
        if (this.state.mapState === MapState.SEARCH_ROUTES) {
          const coords = [
            this.destinationMarker.props.location,
            position.coords,
          ]
          this.mapRef.fitToCoordinates(coords, {
            edgePadding: {top: 400, right: 100, left: 100, bottom: 350},
            animated: true,
          })
        } else {
          this.mapRef.animateToRegion(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.001,
            },
            ANIMATION_DUR
          )
        }
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000}
    )
  }

  setDestinationMarker(location, title, description) {
    this.destinationMarker = (
      <Marker
        location={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title={title}
        description={description}
        image="destination"
      />
    )
  }

  setUserLocationMarker(location, title, description) {
    this.userLocationMarker = (
      <Marker
        location={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title={title}
        description={description}
        image="person"
      />
    )
  }

  clearDestinationMarker() {
    this.destinationMarker = null
  }

  clearUserLocationMarker() {
    this.userLocationMarker = null
  }

  searchRoute() {
    if (this.userLocationMarker == null) {
      Alert.alert('Please enter a start location!')
      return
    }
    this.routing = (
      <MapViewDirections
        origin={{
          latitude: this.userLocationMarker.props.location.latitude,
          longitude: this.userLocationMarker.props.location.longitude,
        }}
        destination={{
          latitude: this.destinationMarker.props.location.latitude,
          longitude: this.destinationMarker.props.location.longitude,
        }}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="blue"
        mode="driving"
      />
    )
    this.setState({mapState: MapState.ROUTE_SEARCHED})
    this.forceUpdate()
  }

  _onMapReady = () => {
    this.setState({marginBottom: 0})
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000}
    )
  }

  // gotoState(nextState) {
  //   const curState = this.state.mapState
  //   switch (nextState) {
  //     case MapState.INIT:
  //       this.clearDestinationMarker()
  //       this.clearUserLocationMarker()
  //       this.routing = null
  //       break
  //     case MapState.SEARCH_ROUTES:
  //       this.routing = null
  //       break
  //     case MapState.ROUTE_SEARCHED:
  //       // TODO disable onClick of searchform?
  //       break
  //     case MapState.ROUTE_ORDERED:
  //       // TODO
  //       break
  //     case MapState.ORDER_CANCELLED:
  //       // goto SEARCH_ROUTES?
  //       break
  //   }
  //   this.setState({mapState: nextState})
  // }

  renderBottomButtons() {
    return [
      // destination button
      <BottomButtons
        key={0}
        visible={this.state.mapState === MapState.INIT}
        iconRight
        addFunc={() => this.props.navigation.navigate('Search')}
        text="destination"
        iconName="arrow-forward"
        bottom="3%"
      />,
      // back button
      <BottomButtons
        key={1}
        visible={this.state.mapState === MapState.SEARCH_ROUTES}
        iconLeft
        addFunc={() => {
          // clear user and destination location and go to INIT state
          this.clearDestinationMarker()
          this.clearUserLocationMarker()
          this.routing = null
          this.setState({mapState: MapState.INIT})
        }}
        text=""
        iconName="arrow-back"
        left="10%"
        right="70%"
        bottom="3%"
      />,
      // search routes button
      <BottomButtons
        key={2}
        visible={this.state.mapState === MapState.SEARCH_ROUTES}
        iconRight
        addFunc={() => this.searchRoute()}
        text="Search Route"
        iconName="arrow-forward"
        left="45%"
        right="10%"
        bottom="3%"
      />,
      // place order button
      <BottomButtons
        visible={this.state.mapState === MapState.ROUTE_SEARCHED}
        iconRight
        key={3}
        addFunc={() => alert('TODO - Place Order function')}
        text="Place Order"
        iconName="arrow-forward"
        left="42%"
        right="10%"
        bottom="3%"
      />,
      // cancel order button
      <BottomButtons
        visible={this.state.mapState === MapState.ROUTE_SEARCHED}
        iconLeft
        key={4}
        addFunc={() =>
          Alert.alert(
            'Cancel Order',
            'Are you sure to cancel your order?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  this.routing = null
                  this.setState({mapState: MapState.SEARCH_ROUTES})
                },
                style: 'cancel',
              },
              {text: 'No', onPress: () => console.log('No Pressed')},
            ],
            {cancelable: false}
          )
        }
        text="Cancel"
        iconName="close"
        left="10%"
        right="60%"
        bottom="3%"
      />,
    ]
  }

  render() {
    return (
      <Container>
        <StyledMapView
          ref={ref => {
            this.mapRef = ref
          }}
          marginBottom={this.state.marginBottom}
          initialRegion={this.state.initialRegion}
          showsMyLocationButton={false}
          showsUserLocation
          followsUserLocation
          onMapReady={this._onMapReady}>
          {this.userLocationMarker}
          {this.destinationMarker}
          {this.routing}
          {/* {this.virtualBusStopMarkers}
          {this.vanMarkers} */}
          {this.currentLocationMarker}
        </StyledMapView>
        <SearchForm
          onStartPress={() => {
            this.props.navigation.navigate('Search')
          }}
          onDestinationPress={() => {
            this.props.navigation.navigate('Search')
          }}
          visible={this.state.mapState === MapState.SEARCH_ROUTES}
          text={
            this.destinationMarker ? this.destinationMarker.props.title : null
          }
          startText={
            this.userLocationMarker ? this.userLocationMarker.props.title : null
          }
        />
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

        {this.renderBottomButtons()}
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
