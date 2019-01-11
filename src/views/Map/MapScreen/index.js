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
import {
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
      type: type,
      animateToRegion: this.animateToRegion.bind(this),
      fitToCoordinates: this.fitToCoordinates.bind(this),
    })
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
          fitToCoordinates={this.fitToCoordinates}
        />

        <RouteInfo fitToCoordinates={this.fitToCoordinates} />
      </Container>
    )
  }
}

MapScreen.propTypes = {
  // journeyDestination: PropTypes.object, // it's used by lodash: _.get(this.props, 'journeyDestination.title')
  // journeyStart: PropTypes.object, // same here
  mapState: PropTypes.string,
  setUserPosition: PropTypes.func,
  swapJourneyStartAndDestination: PropTypes.func,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
  }),
  dispatch => ({
    setUserPosition: payload => dispatch(setUserPosition(payload)),
    swapJourneyStartAndDestination: () =>
      dispatch(swapJourneyStartAndDestination()),
  })
)(MapScreen)
