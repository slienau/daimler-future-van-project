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
import {Dimensions} from 'react-native'
import _ from 'lodash'
import {
  setUserPosition,
  setJourneyStart,
  setVisibleCoordinates,
} from '../../../ducks/map'
import {fetchActiveOrder} from '../../../ducks/orders'
import Info from './Info'
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
    this.props.fetchActiveOrder()
  }

  componentDidUpdate() {
    if (this.props.visibleCoordinates.length === 1)
      this.animateToRegion(this.props.visibleCoordinates[0])
    else if (this.props.visibleCoordinates.length > 1) {
      let edgePadding = {
        top: Dimensions.get('window').height * this.props.edgePadding.top,
        bottom: Dimensions.get('window').height * this.props.edgePadding.bottom,
        left: Dimensions.get('window').width * this.props.edgePadding.left,
        right: Dimensions.get('window').width * this.props.edgePadding.right,
      }
      edgePadding = _.mapValues(
        edgePadding,
        value => value * Dimensions.get('window').scale
      )
      this.fitToCoordinates(this.props.visibleCoordinates, edgePadding)
    }
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

  fitToCoordinates = (coords, edgePadding) => {
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
        // this.animateToRegion(position.coords)
        this.props.setVisibleCoordinates([position.coords])
      },
      error => this.setState({error: error.message})
    )
  }

  toSearchView = type => {
    this.props.navigation.navigate('Search', {
      type: type,
    })
  }

  render() {
    let mapRegion = defaultMapRegion
    if (this.props.userPosition !== null) {
      mapRegion = {
        latitude: this.props.userPosition.latitude,
        longitude: this.props.userPosition.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
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

        <BottomButtons toSearchView={this.toSearchView} />

        <Info
          toRideScreen={() => this.props.navigation.navigate('RideScreen')}
        />
      </Container>
    )
  }
}

MapScreen.propTypes = {
  edgePadding: PropTypes.object,
  fetchActiveOrder: PropTypes.func,
  mapState: PropTypes.string,
  setJourneyStart: PropTypes.func,
  setUserPosition: PropTypes.func,
  setVisibleCoordinates: PropTypes.func,
  userPosition: PropTypes.object,
  visibleCoordinates: PropTypes.array,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    userPosition: state.map.userPosition,
    visibleCoordinates: state.map.visibleCoordinates,
    edgePadding: state.map.edgePadding,
  }),
  dispatch => ({
    fetchActiveOrder: payload => dispatch(fetchActiveOrder(payload)),
    setUserPosition: payload => dispatch(setUserPosition(payload)),
    setJourneyStart: payload => dispatch(setJourneyStart(payload)),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(MapScreen)
