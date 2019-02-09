import React from 'react'
import {
  clearRoutes,
  MapState,
  resetMapState,
  fetchRoutes,
  setVisibleCoordinates,
} from '../../../ducks/map'
import {connect} from 'react-redux'
import DestinationButton from './DestinationButton'
import BackButton from './BackButton'
import SearchRoutesButton from './SearchRoutesButton'
import PlaceOrderButton from './PlaceOrderButton'
import CancelOrderButton from './CancelOrderButton'
import {cancelActiveOrder, placeOrder} from '../../../ducks/orders'
import {Alert, StyleSheet, View} from 'react-native'
import {Toast} from 'native-base'
import PropTypes from 'prop-types'
import _ from 'lodash'
import CustomFabWithIcon from '../../../components/UI/CustomFabWithIcon'
import PushNotification from 'react-native-push-notification'
import {defaultDangerToast, defaultSuccessToast} from '../../../lib/toasts'

class BottomButtons extends React.Component {
  state = {
    expireProgress: 100,
  }

  componentDidMount() {
    this.checkProgressInterval = setInterval(
      () => this.checkRouteExpireProgress(),
      1200
    )
  }

  componentWillUnmount() {
    clearInterval(this.checkProgressInterval)
  }

  checkProgressInterval = null

  zoomToMarkers = () => {
    if (!this.props.userStartLocation || !this.props.userDestinationLocation)
      return
    const coords = [
      this.props.userStartLocation.location,
      this.props.userDestinationLocation.location,
    ]
    this.props.setVisibleCoordinates(coords)
  }

  cancelActiveOrder = async () => {
    Alert.alert(
      'Cancel your order',
      'Do you want to cancel your current order?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              PushNotification.cancelAllLocalNotifications()
              await this.props.cancelActiveOrder()
              Toast.show(defaultSuccessToast('Your order has been canceled!'))
            } catch (error) {
              Toast.show(
                defaultDangerToast(
                  "Your order couldn't be canceled! " + error.message
                )
              )
            }
          },
        },
        {text: 'No'},
      ],
      {cancelable: true}
    )
  }

  fetchRoutes = async () => {
    try {
      await this.props.fetchRoutes()
    } catch (error) {
      if (error.code === 404)
        Toast.show(defaultDangerToast('No routes found. ' + error.message, 0))
      else
        Toast.show(defaultDangerToast('Error getting routes. ' + error.message))
    }
  }

  checkRouteExpireProgress = () => {
    const validUntil = _.get(this.props.routes, '0.validUntil')
    if (!validUntil) return
    let currentDiff = new Date(validUntil).getTime() - new Date().getTime()
    if (currentDiff <= 0) currentDiff = 0
    this.setState({
      expireProgress: parseInt(((currentDiff / 60000) * 100).toFixed(0)),
    })
  }

  placeOrder = async () => {
    if (this.state.expireProgress === 0) return this.props.fetchRoutes()
    Alert.alert(
      'Confirm your order',
      'Do you want to order this route?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            let success = false
            try {
              await this.props.placeOrder({
                routeId: this.props.routes[0].id,
              })
              success = true
            } catch (error) {
              Toast.show(
                defaultDangerToast(
                  "Your order couldn't be confirmed! " + error.message
                )
              )
            }
            if (success) {
              Toast.show(defaultSuccessToast('Your order has been confirmed!'))
              PushNotification.cancelAllLocalNotifications()
              PushNotification.localNotificationSchedule({
                message: 'Your van will arrive at the exit point in a minute',
                date: new Date(
                  new Date(
                    _.get(this.props.routes, '0.vanETAatEndVBS')
                  ).getTime() -
                    60 * 1000
                ),
              })
              PushNotification.localNotificationSchedule({
                message: 'Your van is at the start point in a minute',
                date: new Date(
                  new Date(
                    _.get(this.props.routes, '0.vanETAatStartVBS')
                  ).getTime() -
                    60 * 1000
                ),
              })
            }
          },
        },
        {text: 'Cancel'},
      ],
      {cancelable: true}
    )
  }

  render() {
    let toReturn
    switch (this.props.mapState) {
      case MapState.INIT:
        toReturn = (
          <DestinationButton
            onPress={() => this.props.toSearchView('DESTINATION')}
          />
        )
        break
      case MapState.SEARCH_ROUTES:
        toReturn = (
          <>
            <BackButton onPress={() => this.props.resetMapState()} />
            <SearchRoutesButton onPress={() => this.fetchRoutes()} />
          </>
        )
        break
      case MapState.ROUTE_SEARCHED:
        toReturn = (
          <>
            <CancelOrderButton
              onPress={() => {
                this.props.clearRoutes()
                this.zoomToMarkers()
              }}
            />
            <View>
              <PlaceOrderButton
                routeExpireProgress={this.state.expireProgress}
                onPress={() => this.placeOrder()}
              />
            </View>
          </>
        )
        break
      case MapState.ROUTE_ORDERED:
        return (
          <CustomFabWithIcon
            icon="md-close"
            onPress={() => this.cancelActiveOrder()}
            position="topLeft"
          />
        )
      default:
        return null
    }
    return (
      <>
        <View style={styles.bottomButtons}>{toReturn}</View>
        {[MapState.INIT, MapState.SEARCH_ROUTES].includes(
          this.props.mapState
        ) && <View style={styles.bottomPadding} />}
      </>
    )
  }
}

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 3,
  },
  bottomPadding: {
    height: 20,
  },
})

BottomButtons.propTypes = {
  cancelActiveOrder: PropTypes.func,
  clearRoutes: PropTypes.func,
  fetchRoutes: PropTypes.func,
  mapState: PropTypes.string,
  placeOrder: PropTypes.func,
  resetMapState: PropTypes.func,
  routes: PropTypes.array,
  setVisibleCoordinates: PropTypes.func,
  toSearchView: PropTypes.func,
  userDestinationLocation: PropTypes.object,
  userStartLocation: PropTypes.object,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    userStartLocation: state.map.userStartLocation,
    userDestinationLocation: state.map.userDestinationLocation,
    routes: state.map.routes,
  }),
  dispatch => ({
    resetMapState: () => dispatch(resetMapState()),
    clearRoutes: () => dispatch(clearRoutes()),
    cancelActiveOrder: () => dispatch(cancelActiveOrder()),
    fetchRoutes: () => dispatch(fetchRoutes()),
    placeOrder: payload => dispatch(placeOrder(payload)),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(BottomButtons)
