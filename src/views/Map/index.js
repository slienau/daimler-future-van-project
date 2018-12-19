import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import MapEncodedPolyline from '../../components/MapEncodedPolyline'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Marker from './Marker'
import {createStackNavigator} from 'react-navigation'
import SearchView from './SearchView'
import {connect} from 'react-redux'
import * as act from '../../ducks/map'
import {Container, Button, Text, Icon, Fab} from 'native-base'
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

class Map extends React.Component {
  state = {
    destinationButton: true,
    userLocationMarker: false,
    placeOrderButton: false,
    cancelOrderButton: false,
    destinationMarker: null,
    routes: null,
    error: null,
    region: {
      latitude: 52.509663,
      longitude: 13.376481,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    },
  }

  // shows current position on the map
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position =>
        this.setState({
          currentLocation: position.coords,
          region: this.getRegionForCoordinates([position.coords]),
          error: null,
        }),
      error => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000}
    )
  }

  // from: https://github.com/react-native-community/react-native-maps/issues/505#issuecomment-243423775
  // expects a list of two coordinate objects and returns a region as specified by the react-native-maps components
  getRegionForCoordinates(points) {
    const lats = _.map(
      points,
      p => p.latitude || _.get(p, 'geometry.location.lat')
    )
    const lngs = _.map(
      points,
      p => p.longitude || _.get(p, 'geometry.location.lng')
    )

    const minX = _.min(lats)
    const maxX = _.max(lats)
    const minY = _.min(lngs)
    const maxY = _.max(lngs)

    return {
      latitude: (minX + maxX) / 2,
      longitude: (minY + maxY) / 2,
      latitudeDelta: (maxX - minX) * 1.5 || 0.01,
      longitudeDelta: (maxY - minY) * 1.5 || 0.001,
    }
  }

  showCurrentLocation = () => {
    this.setState({
      userLocationMarker: true,
    })
  }

  handleSearchResult = (data, details) => {
    if (!details) return
    this.props.addSearchResult(details)
    this.setState({
      placeOrderButton: true,
      cancelOrderButton: true,
      destinationButton: false,
      destinationMarker: {
        location: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
        title: details.name,
        description: details.vicinity,
      },
      region: this.getRegionForCoordinates([
        this.state.currentLocation,
        ...this.props.map.searchResults,
      ]),
    })
    this.fetchRoutes()
  }

  fetchRoutes = async () => {
    const routesPayload = {
      start: _.pick(this.state.currentLocation, ['latitude', 'longitude']),
      destination: this.state.destinationMarker.location,
    }
    try {
      const {data} = await api.post('/routes', routesPayload)
      this.setState({routes: data})
    } catch (e) {
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
          marginBottom={0}
          region={this.state.region}
          showsMyLocationButton={false}
          showsUserLocation
          followsUserLocation>
          {this.state.userLocationMarker && (
            <Marker
              location={this.state.currentLocation}
              title={'My Current Location'}
              image="person"
            />
          )}
          {this.state.destinationMarker && (
            <Marker image="destination" {...this.state.destinationMarker} />
          )}
          {this.renderRoutes()}
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

        {this.state.destinationButton && (
          <StyledButton
            rounded
            iconRight
            light
            onPress={() =>
              this.props.navigation.navigate('Search', {
                predefinedPlaces: _.uniq(this.props.map.searchResults),
                onSearchResult: (data, details) =>
                  this.handleSearchResult(data, details),
              })
            }>
            <Text>destination </Text>
            <Icon name="arrow-forward" />
          </StyledButton>
        )}
        {this.state.cancelOrderButton && (
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
        )}
        {this.state.placeOrderButton && (
          <StyledPlaceOrderButton
            rounded
            iconRight
            light
            onPress={() => alert('TODO - Place Order')}>
            <Text>Place Order </Text>
            <Icon name="arrow-forward" />
          </StyledPlaceOrderButton>
        )}
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
