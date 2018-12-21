import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import MapEncodedPolyline from '../../components/MapEncodedPolyline'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Marker from './Marker'
import SearchForm from '../Map/SearchForm'
import BottomButtons from '../Map/BottomButtons'
import {createStackNavigator} from 'react-navigation'
import SearchView from './SearchView'
import {connect} from 'react-redux'
import * as act from '../../ducks/map'
import {Container, Icon, Fab} from 'native-base'
import api from '../../lib/api'

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
`
// For bottom button
const StyledMenu = styled(Fab)`
  margin-top: 5px;
  background-color: gray;
`

const StyledFab = styled(Fab)`
  margin-bottom: 55;
`

const MapState = {
  INIT: 'INIT', // the inital state of the map, where either start nor destination location are set
  SEARCH_ROUTES: 'SEARCH_ROUTES', // the state, when a destination is set, shows the SearchForm and the butto search for a route
  ROUTE_SEARCHED: 'ROUTE_SEARCHED', // when a route has been searched and we get a route from the backend, which we then can order
  ROUTE_ORDERED: 'ROUTE_ORDERED', // the state after ordering the route, where we can cancel the order and track the vans live position (own view?)
  ORDER_CANCELLED: 'ORDER_CANCELLED', // after the order is cancelled (necessary? own view? pop up?)
}

const ANIMATION_DUR = 1500

class Map extends React.Component {
  state = {
    mapState: MapState.INIT,
    userLocationMarker: null,
    destinationMarker: null,
    routes: null,
    initialRegion: {
      latitude: 52.509663,
      longitude: 13.376481,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    },
  }

  mapRef = null

  showCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          currentLocation: position.coords,
        })
        if (this.state.mapState === MapState.SEARCH_ROUTES) {
          const coords = [
            this.state.destinationMarker.location,
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
      error => {
        this.setState({error: error.message})
        Alert.alert('TIMEOUT')
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
    )
  }

  toSearchView = () => {
    this.props.navigation.navigate('Search', {
      predefinedPlaces: _.uniqBy(this.props.map.searchResults, 'id'),
      onSearchResult: (data, details) => this.handleSearchResult(data, details),
    })
  }
  renderBottomButtons() {
    return [
      // destination button
      <BottomButtons
        key={0}
        visible={this.state.mapState === MapState.INIT}
        iconRight
        addFunc={() => this.toSearchView()}
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
          this.setState({
            mapState: MapState.INIT,
            destinationMarker: null,
            userLocationMarker: null,
            routes: null,
          })
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
        addFunc={() => this.fetchRoutes()}
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
                  this.setState({
                    mapState: MapState.SEARCH_ROUTES,
                    routes: null,
                  })
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

  handleSearchResult = (data, details) => {
    if (!details) return
    details.description = details.name
    this.props.addSearchResult(details)
    const destinationLocation = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    switch (this.state.mapState) {
      case MapState.INIT:
        this.setState({
          mapState: MapState.SEARCH_ROUTES,
          destinationMarker: {
            location: destinationLocation,
            title: details.name,
            description: details.vicinity,
          },
        })
        this.mapRef.animateToRegion(
          {
            latitude: details.geometry.location.latitude,
            longitude: details.geometry.location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          ANIMATION_DUR
        )
        break
      case MapState.SEARCH_ROUTES:
        this.setState({
          userLocationMarker: {
            location: destinationLocation,
            title: details.name,
            description: details.vicinity,
          },
          mapState: MapState.SEARCH_ROUTES, // stay in SEARCH_ROUTES
        })
        const coords = [
          this.state.destinationMarker.location,
          destinationLocation,
        ]
        this.mapRef.fitToCoordinates(coords, {
          edgePadding: {top: 400, right: 100, left: 100, bottom: 350},
          animated: true,
        })
        break
    }
  }

  fetchRoutes = async () => {
    const routesPayload = {
      start: this.state.userLocationMarker.location,
      destination: this.state.destinationMarker.location,
    }
    console.log(routesPayload)
    try {
      const {data} = await api.post('/routes', routesPayload)
      this.setState({routes: data, mapState: MapState.ROUTE_SEARCHED})
    } catch (e) {
      console.warn(e)
      this.setState({routes: null})
    }
  }

  renderRoutes = () => {
    if (!this.state.routes || !this.state.routes.length) return
    const colors = ['red', 'green', 'blue']
    return ['toStartRoute', 'vanRoute', 'toDestinationRoute']
      .map(r =>
        _.get(this.state.routes[0][r], 'routes.0.overview_polyline.points')
      )
      .map((p, i) => (
        <MapEncodedPolyline
          key={i}
          points={p}
          strokeWidth={3}
          strokeColor={colors[i]}
        />
      ))
  }

  render() {
    return (
      <Container>
        <StyledMapView
          ref={ref => {
            this.mapRef = ref
          }}
          initialRegion={this.state.initialRegion}
          showsUserLocation
          showsMyLocationButton={false}>
          {this.state.userLocationMarker && (
            <Marker
              location={this.state.userLocationMarker.location}
              title={'My Current Location'}
              image="person"
            />
          )}
          {this.state.destinationMarker && (
            <Marker image="destination" {...this.state.destinationMarker} />
          )}
          {this.renderRoutes()}
        </StyledMapView>
        <SearchForm
          onStartPress={() => {
            this.toSearchView()
          }}
          onDestinationPress={() => {
            this.toSearchView()
          }}
          visible={this.state.mapState === MapState.SEARCH_ROUTES}
          text={_.get(this.state, 'destinationMarker.title')}
          startText={_.get(this.state, 'userLocationMarker.title')}
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
  addSearchResult: PropTypes.func,
  map: PropTypes.object,
}

const MapScreen = connect(
  state => ({
    map: state.map,
  }),
  dispatch => ({
    addSearchResult: result => {
      dispatch(act.addSearchResultAction(result))
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
