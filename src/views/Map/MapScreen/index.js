import React from 'react'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import SearchForm from './SearchForm'
import BottomButtons from './BottomButtons'
import Routes from './Routes'
import MapMarkers from './MapMarkers'
import {connect} from 'react-redux'
import {Container} from 'native-base'
import {setUserPosition, setJourneyStart} from '../../../ducks/map'
import RouteInfo from './RouteInfo'
import {defaultMapRegion} from '../../../lib/config'
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
  componentDidMount() {
    this.getCurrentPosition()
  }

  mapRef = null

  animateToRegion = location => {
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

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.props.setUserPosition(position.coords)
        this.props.setJourneyStart({
          location: position.coords,
          title: 'Current location',
          description: 'Current location',
        })
        this.animateToRegion(position.coords)
      },
      error => this.setState({error: error.message})
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
    let mapRegion = defaultMapRegion
    if (this.props.userPosition !== null) {
      mapRegion = {
        latitude: this.props.userPosition.latitude,
        longitude: this.props.userPosition.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    }

    return (
      <Container>
        <StyledMapView
          ref={ref => {
            this.mapRef = ref
          }}
          initialRegion={mapRegion}
          showsUserLocation
          showsMyLocationButton={false}>
          <Routes />
          <MapMarkers />
        </StyledMapView>

        <SearchForm toSearchView={this.toSearchView} />

        <MenuButton
          mapState={this.props.mapState}
          onPress={() => this.props.navigation.openDrawer()}
        />

        <CurrentLocationButton
          mapState={this.props.mapState}
          onPress={() => this.getCurrentPosition()}
        />

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
  mapState: PropTypes.string,
  setJourneyStart: PropTypes.func,
  setUserPosition: PropTypes.func,
  userPosition: PropTypes.object,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    userPosition: state.map.userPosition,
  }),
  dispatch => ({
    setUserPosition: payload => dispatch(setUserPosition(payload)),
    setJourneyStart: payload => dispatch(setJourneyStart(payload)),
  })
)(MapScreen)
