import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import _ from 'lodash'
import SearchForm from './SearchForm'
import BottomButtons from './BottomButtons'
import Routes from './Routes'
import MapMarkers from './MapMarkers'
import {connect} from 'react-redux'
import {Container} from 'native-base'
import {placeOrder, cancelOrder} from '../../../ducks/orders'
import {
  fetchRoutes,
  addSearchResultAction,
  changeMapState,
  MapState,
  setJourneyStart,
  setJourneyDestination,
  setUserPosition,
  swapJourneyStartAndDestination,
} from '../../../ducks/map'
import RouteInfo from './RouteInfo'
import {initialMapRegion} from '../../../lib/config'
import MenuButton from './Buttons/MenuButton'
import CurrentLocationButton from './Buttons/CurrentLocationButton'

const StyledMapView = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

class MapScreen extends React.Component {
  mapRef = null

  animateToRegion(location) {
    this.mapRef.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1500
    )
  }

  fitToCoordinates = (
    coords,
    edgePadding = {top: 400, right: 100, left: 100, bottom: 350}
  ) => {
    this.mapRef.fitToCoordinates(coords, {
      edgePadding: edgePadding,
      animated: true,
    })
  }

  showCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.props.setUserPosition(position.coords)
        this.animateToRegion(position.coords)
      },
      error => {
        this.setState({error: error.message})
        Alert.alert('TIMEOUT')
      }
      // {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000} // OMITTING THESE OPTIONS RESULTS IN BETTER EXPERIENCE
    )
  }

  toSearchView = type => {
    this.props.navigation.navigate('Search', {
      predefinedPlaces: _.uniqBy(this.props.map.searchResults, 'id'),
      onSearchResult: (data, details) =>
        this.handleSearchResult(data, details, type),
    })
  }

  handleSearchResult = (data, details, type) => {
    if (!details) return

    // extract needed data from the search result and distinguish between current location or not
    // if current location, we dont want to add it to the list of last searches
    if (details.description === 'Current location') {
      // name field is not set for current location, so set it
      details.name = details.description
    } else {
      details.description = details.name
      this.props.addSearchResult(details)
    }
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    if (type === 'DESTINATION') {
      this.handleDestinationSearchResult(details, location)
    } else if (type === 'START') {
      this.handleStartSearchResult(details, location)
    }
  }

  handleDestinationSearchResult = (details, location) => {
    const journeyDestination = {
      location: location,
      title: details.name,
      description: details.vicinity,
    }
    switch (this.props.mapState) {
      case MapState.INIT:
        this.props.changeMapState(MapState.SEARCH_ROUTES)
        this.props.setJourneyDestination(journeyDestination)
        this.animateToRegion(location)
        break
      case MapState.SEARCH_ROUTES:
        this.props.setJourneyDestination(journeyDestination)
        // check whether start location is already set
        if (this.props.journeyStart != null) {
          // fit zoom to start and destination if so
          const coords = [location, this.props.journeyStart.location]
          this.fitToCoordinates(coords)
        } else {
          // otherwise, only zoom to destination
          this.animateToRegion(location)
        }
        break
    }
  }

  handleStartSearchResult = (details, location) => {
    const journeyStart = {
      location: location,
      title: details.name,
      description: details.vicinity,
    }
    this.props.setJourneyStart(journeyStart)
    this.props.changeMapState(MapState.SEARCH_ROUTES)
    // check if destination is set
    if (this.props.journeyDestination != null) {
      // fit zoom to start and destination if so
      const coords = [location, this.props.journeyDestination.location]
      this.fitToCoordinates(coords)
    } else {
      // otherwise, only zoom to start
      this.animateToRegion(location)
    }
  }

  fetchRoutes = async () => {
    // TODO: start und destination direkt in redux handeln
    await this.props.fetchRoutes({
      start: this.props.journeyStart.location,
      destination: this.props.journeyDestination.location,
    })
    this.props.changeMapState(MapState.ROUTE_SEARCHED)
  }

  placeOrder = async () => {
    await this.props.placeOrder({
      // vanId: this.props.routes[0].vanId
      start: this.props.routes[0].startStation._id,
      destination: this.props.routes[0].endStation._id,
    })
    this.props.changeMapState(MapState.ROUTE_ORDERED)
  }

  cancelOrder = async () => {
    await this.props.cancelOrder({
      id: this.props.orders.activeOrder._id,
    })
    this.props.changeMapState(MapState.ROUTE_ORDERED)
  }

  render() {
    return (
      <Container>
        <StyledMapView
          ref={ref => {
            this.mapRef = ref
          }}
          initialRegion={initialMapRegion}
          showsUserLocation
          showsMyLocationButton={false}>
          <Routes />
          <MapMarkers />
        </StyledMapView>

        <SearchForm
          onStartPress={() => {
            this.toSearchView('START')
          }}
          onDestinationPress={() => {
            this.toSearchView('DESTINATION')
          }}
          destinationText={_.get(this.props, 'journeyDestination.title')}
          startText={_.get(this.props, 'journeyStart.title')}
          onSwapPress={() => {
            this.props.swapJourneyStartAndDestination()
          }}
        />

        <MenuButton
          mapState={this.props.mapState}
          onPress={() => this.props.navigation.openDrawer()}
        />

        <CurrentLocationButton onPress={() => this.showCurrentLocation()} />

        <BottomButtons
          toSearchView={this.toSearchView}
          fetchRoutes={this.fetchRoutes}
          placeOrder={this.placeOrder}
          cancelOrder={this.cancelOrder}
          fitToCoordinates={this.fitToCoordinates}
        />

        <RouteInfo fitToCoordinates={this.fitToCoordinates} />
      </Container>
    )
  }
}

MapScreen.propTypes = {
  addSearchResult: PropTypes.func,
  cancelOrder: PropTypes.func,
  changeMapState: PropTypes.func,
  fetchRoutes: PropTypes.func,
  journeyDestination: PropTypes.object,
  journeyStart: PropTypes.object,
  map: PropTypes.object,
  mapState: PropTypes.string,
  orders: PropTypes.object,
  placeOrder: PropTypes.func,
  routes: PropTypes.array,
  setJourneyDestination: PropTypes.func,
  setJourneyStart: PropTypes.func,
  setUserPosition: PropTypes.func,
  swapJourneyStartAndDestination: PropTypes.func,
  // userPosition: PropTypes.object,
}

export default connect(
  state => ({
    map: state.map,
    mapState: state.map.mapState,
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
    // userPosition: state.map.userPosition,
    routes: state.map.routes,
    orders: state.orders,
  }),
  dispatch => ({
    addSearchResult: result => {
      dispatch(addSearchResultAction(result))
    },
    placeOrder: payload => dispatch(placeOrder(payload)),
    fetchRoutes: payload => dispatch(fetchRoutes(payload)),
    changeMapState: payload => dispatch(changeMapState(payload)),
    cancelOrder: payload => dispatch(cancelOrder(payload)),
    setJourneyStart: payload => dispatch(setJourneyStart(payload)),
    setJourneyDestination: payload => dispatch(setJourneyDestination(payload)),
    setUserPosition: payload => dispatch(setUserPosition(payload)),
    swapJourneyStartAndDestination: () =>
      dispatch(swapJourneyStartAndDestination()),
  })
)(MapScreen)
