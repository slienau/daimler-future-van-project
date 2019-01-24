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
  MapState,
  setUserPosition,
  setJourneyStart,
  setVisibleCoordinates,
  changeMapState,
  setVans,
  resetMapState,
} from '../../../ducks/map'
import {fetchActiveOrder, setActiveOrderStatus} from '../../../ducks/orders'
import Info from './Info'
import {defaultMapRegion} from '../../../lib/config'
import MenuButton from './Buttons/MenuButton'
import CurrentLocationButton from './Buttons/CurrentLocationButton'
import api from '../../../lib/api'

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
    this.watchPosition()
    this.continuouslyUpdatePosition()
    this.getVans()
    this.props.fetchActiveOrder()
  }

  componentDidUpdate() {
    // check if we have to show the RideScreen
    if (
      this.props.mapState === MapState.ROUTE_ORDERED &&
      _.get(this.props.activeOrder, 'startTime')
    )
      setImmediate(() => this.toRideScreen())
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

  componentWillUnmount() {
    clearTimeout(this.updatePositionTimerId)
    navigator.geolocation.clearWatch(this.watchId)
    clearTimeout(this.getVansTimerId)
  }

  mapRef = null
  updatePositionTimerId = null
  watchId = null
  getVansTimerId = null

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

  toMapScreen = () => {
    this.props.resetMapState()
    this.props.navigation.navigate('Map')
  }

  continuouslyUpdatePosition = () => {
    const fn = async () => {
      if (
        [MapState.ROUTE_ORDERED, MapState.VAN_RIDE].includes(
          this.props.mapState
        ) &&
        this.props.userPosition
      ) {
        try {
          const resp = await api.get('/activeorder/status', {
            params: {
              passengerLatitude: this.props.userPosition.latitude,
              passengerLongitude: this.props.userPosition.longitude,
            },
          })
          this.props.setActiveOrderStatus(resp.data)
        } catch (e) {
          console.log(e)
        }
      }
      this.updatePositionTimerId = setTimeout(fn, 5000)
    }
    fn()
  }

  watchPosition = () => {
    this.watchId = navigator.geolocation.watchPosition(
      position => this.props.setUserPosition(position.coords),
      error => this.setState({error: error.message}),
      {
        distanceFilter: 3,
        useSignificantChanges: true,
      }
    )
  }

  getVans = () => {
    const fn = async () => {
      if (
        [MapState.INIT, MapState.SEARCH_ROUTES].includes(this.props.mapState)
      ) {
        try {
          const {data} = await api.get('/vans')
          this.props.setVans(data)
        } catch (e) {
          console.log(e)
        }
      }
      this.getVansTimerId = setTimeout(fn, 5000)
    }
    fn()
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

  toRideScreen = () => {
    this.props.changeMapState(MapState.VAN_RIDE)
    this.props.navigation.navigate('RideScreen')
  }

  enterVan = async () => {
    if (_.get(this.props.activeOrder, 'startTime')) return
    try {
      await api.put('/activeorder', {
        action: 'startride',
        userLocation: _.pick(this.props.userPosition, [
          'latitude',
          'longitude',
        ]),
      })
      this.toRideScreen()
    } catch (e) {
      console.log(e)
    }
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
          onEnterVanPress={() => this.enterVan()}
          toMapScreen={() => this.toMapScreen()}
        />
      </Container>
    )
  }
}

MapScreen.propTypes = {
  activeOrder: PropTypes.object,
  changeMapState: PropTypes.func,
  edgePadding: PropTypes.object,
  fetchActiveOrder: PropTypes.func,
  mapState: PropTypes.string,
  setActiveOrderStatus: PropTypes.func,
  resetMapState: PropTypes.func,
  setActiveOrderState: PropTypes.func,
  setJourneyStart: PropTypes.func,
  setUserPosition: PropTypes.func,
  setVans: PropTypes.func,
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
    activeOrder: state.orders.activeOrder,
  }),
  dispatch => ({
    fetchActiveOrder: payload => dispatch(fetchActiveOrder(payload)),
    setUserPosition: payload => dispatch(setUserPosition(payload)),
    setJourneyStart: payload => dispatch(setJourneyStart(payload)),
    resetMapState: () => dispatch(resetMapState()),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
    setActiveOrderStatus: payload => dispatch(setActiveOrderStatus(payload)),
    changeMapState: payload => dispatch(changeMapState(payload)),
    setVans: payload => dispatch(setVans(payload)),
  })
)(MapScreen)
