import React from 'react'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import SearchForm from './components/SearchForm'
import BottomButtons from './components/BottomButtons'
import Routes from './components/Routes'
import MapMarkers from './components/MapMarkers'
import {connect} from 'react-redux'
import {Toast, Container} from 'native-base'
import {Dimensions, View, StyleSheet} from 'react-native'
import _ from 'lodash'
// import PushNotification from 'react-native-push-notification'
import {
  OrderState,
  setCurrentUserLocation,
  setUserStartLocation,
  setVisibleCoordinates,
  visibleCoordinatesUpdated,
  setVans,
} from '../../ducks/map'
import {
  fetchActiveOrder,
  startRide,
  setActiveOrderStatus,
} from '../../ducks/orders'
import Info from './components/Info'
import {defaultMapRegion} from '../../lib/config'
import api from '../../lib/api'
import {defaultDangerToast, defaultToast} from '../../lib/toasts'
import TopButtons from './components/TopButtons'

class MapScreen extends React.Component {
  componentDidMount() {
    this.getCurrentPosition()
    this.watchPosition()
    this.continuouslyUpdatePosition()
    this.getVans()
    this.props.fetchActiveOrder()
  }

  componentWillUpdate(nextProps, nextState) {
    // check if we have to show the RideScreen
    if (
      nextProps.orderState === OrderState.VAN_RIDE &&
      this.props.orderState !== OrderState.VAN_RIDE
    ) {
      setImmediate(() => this.props.navigation.navigate('Ride'))
    }
  }

  componentDidUpdate() {
    if (
      this.props.orderState === OrderState.INIT &&
      !this.props.userStartLocation
    )
      this.getCurrentPosition()
    if (!this.props.hasVisibleCoordinatesUpdate) return
    if (this.props.visibleCoordinates.length === 1)
      this.animateToRegion(this.props.visibleCoordinates[0])
    else if (this.props.visibleCoordinates.length > 1) {
      this.fitToCoordinates(
        this.props.visibleCoordinates,
        _.mapValues(
          {
            top: Dimensions.get('window').height * this.props.edgePadding.top,
            bottom:
              Dimensions.get('window').height * this.props.edgePadding.bottom,
            left: Dimensions.get('window').width * this.props.edgePadding.left,
            right:
              Dimensions.get('window').width * this.props.edgePadding.right,
          },
          value => value * Dimensions.get('window').scale
        )
      )
    }
    this.props.visibleCoordinatesUpdated()
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

  continuouslyUpdatePosition = () => {
    const fn = async () => {
      if (
        [OrderState.ROUTE_ORDERED, OrderState.VAN_RIDE].includes(
          this.props.orderState
        ) &&
        this.props.currentUserLocation
      ) {
        try {
          // TODO: move api call to redux
          const {data} = await api.get('/activeorder/status', {
            params: {
              passengerLatitude: this.props.currentUserLocation.latitude,
              passengerLongitude: this.props.currentUserLocation.longitude,
            },
          })
          const newPassengers = _.difference(
            data.otherPassengers,
            _.get(this.props.activeOrderStatus, 'otherPassengers', [])
          )
          this.props.setActiveOrderStatus(data)
          if (newPassengers.length > 0) {
            const message = `${newPassengers.join(
              ','
            )} will join you on your ride`
            // PushNotification.localNotification({
            //   message,
            // })
            Toast.show(defaultToast(message))
          }
        } catch (error) {
          Toast.show(
            defaultDangerToast(
              'Error getting current active order status. ' + error.message
            )
          )
        }
      }
      this.updatePositionTimerId = setTimeout(fn, 1000)
    }
    fn()
  }

  watchPosition = () => {
    this.watchId = navigator.geolocation.watchPosition(
      position => this.props.setCurrentUserLocation(position.coords),
      error => {
        if (!error.message.includes('temporarily'))
          Toast.show(
            defaultDangerToast('Error watching user position. ' + error.message)
          )
      },
      {
        distanceFilter: 3,
        useSignificantChanges: true,
      }
    )
  }

  getVans = () => {
    const fn = async () => {
      if (
        [OrderState.INIT, OrderState.SEARCH_ROUTES].includes(
          this.props.orderState
        )
      ) {
        try {
          // TODO: move api call to redux
          const {data} = await api.get('/vans')
          this.props.setVans(data)
        } catch (error) {
          Toast.show(
            defaultDangerToast("Couldn't get van positions. " + error.message)
          )
        }
      }
      this.getVansTimerId = setTimeout(fn, 5000)
    }
    fn()
  }

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.props.setCurrentUserLocation(position.coords)
        this.props.setJourneyStart({
          location: position.coords,
          title: 'Current location',
          description: 'Current location',
        })
        // this.animateToRegion(position.coords)
        this.props.setVisibleCoordinates([position.coords])
      },
      error => {
        Toast.show(
          defaultDangerToast("Couldn't get current position. " + error.message)
        )
      }
    )
  }

  toSearchView = type => {
    this.props.navigation.navigate('Search', {
      type: type,
    })
  }

  enterVan = async () => {
    if (_.get(this.props.activeOrder, 'vanEnterTime')) return
    try {
      this.props.startRide()
    } catch (error) {
      Toast.show(defaultDangerToast("Couldn't enter van. " + error.message))
    }
  }

  render() {
    let mapRegion = defaultMapRegion
    if (this.props.currentUserLocation !== null) {
      mapRegion = {
        latitude: this.props.currentUserLocation.latitude,
        longitude: this.props.currentUserLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    }

    return (
      <Container>
        <FullScreenMapView
          ref={ref => {
            this.mapRef = ref
          }}
          initialRegion={mapRegion}
          showsUserLocation
          showsMyLocationButton={false}>
          <Routes />
          <MapMarkers />
        </FullScreenMapView>

        <View style={styles.mapOverlayContainer}>
          <TopView>
            <SearchForm toSearchView={this.toSearchView} />
            <TopButtons
              toAccountView={() => this.props.navigation.push('Account')}
              onCurrentLocationButtonPress={() => this.getCurrentPosition()}
            />
          </TopView>

          <MapPlaceholder />

          <BottomView>
            <BottomButtons toSearchView={this.toSearchView} />

            <Info onEnterVanPress={() => this.enterVan()} />
          </BottomView>
        </View>
      </Container>
    )
  }
}

const FullScreenMapView = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const MapPlaceholder = styled(View)`
  flex: 4;
`

const TopView = styled(View)`
  flex: 2;
  justify-content: flex-start;
`

const BottomView = styled(View)`
  flex: 2;
  justify-content: flex-end;
`

const styles = StyleSheet.create({
  mapOverlayContainer: {
    flex: 1,
    flexDirection: 'column',
  },
})

MapScreen.propTypes = {
  activeOrder: PropTypes.object,
  activeOrderStatus: PropTypes.object,
  currentUserLocation: PropTypes.object,
  edgePadding: PropTypes.object,
  fetchActiveOrder: PropTypes.func,
  hasVisibleCoordinatesUpdate: PropTypes.bool,
  orderState: PropTypes.string,
  setActiveOrderStatus: PropTypes.func,
  setCurrentUserLocation: PropTypes.func,
  setJourneyStart: PropTypes.func,
  setVans: PropTypes.func,
  setVisibleCoordinates: PropTypes.func,
  startRide: PropTypes.func,
  userStartLocation: PropTypes.object,
  visibleCoordinates: PropTypes.array,
  visibleCoordinatesUpdated: PropTypes.func,
}

export default connect(
  state => ({
    orderState: state.map.orderState,
    currentUserLocation: state.map.currentUserLocation,
    userStartLocation: state.map.userStartLocation,
    visibleCoordinates: state.map.visibleCoordinates,
    hasVisibleCoordinatesUpdate: state.map.hasVisibleCoordinatesUpdate,
    edgePadding: state.map.edgePadding,
    activeOrder: state.orders.activeOrder,
    activeOrderStatus: state.orders.activeOrderStatus,
  }),
  dispatch => ({
    fetchActiveOrder: payload => dispatch(fetchActiveOrder(payload)),
    setCurrentUserLocation: payload =>
      dispatch(setCurrentUserLocation(payload)),
    setJourneyStart: payload => dispatch(setUserStartLocation(payload)),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
    visibleCoordinatesUpdated: () => dispatch(visibleCoordinatesUpdated()),
    setVans: payload => dispatch(setVans(payload)),
    startRide: () => dispatch(startRide()),
    setActiveOrderStatus: payload => dispatch(setActiveOrderStatus(payload)),
  })
)(MapScreen)
