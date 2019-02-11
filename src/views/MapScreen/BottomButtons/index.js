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
import ClearRoutesButton from './ClearRoutesButton'
import {placeOrder} from '../../../ducks/orders'
import {Alert, StyleSheet, View} from 'react-native'
import {Toast} from 'native-base'
import PropTypes from 'prop-types'
import _ from 'lodash'
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
    const validUntil = _.get(this.props.routeInfo, 'validUntil')
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
                routeId: this.props.routeInfo.id,
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
                    _.get(this.props.routeInfo, 'vanETAatEndVBS')
                  ).getTime() -
                    60 * 1000
                ),
              })
              PushNotification.localNotificationSchedule({
                message: 'Your van is at the start point in a minute',
                date: new Date(
                  new Date(
                    _.get(this.props.routeInfo, 'vanETAatStartVBS')
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
            <ClearRoutesButton
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
        return null
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
  clearRoutes: PropTypes.func,
  fetchRoutes: PropTypes.func,
  mapState: PropTypes.string,
  placeOrder: PropTypes.func,
  resetMapState: PropTypes.func,
  routeInfo: PropTypes.object,
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
    routeInfo: state.map.routeInfo,
  }),
  dispatch => ({
    resetMapState: () => dispatch(resetMapState()),
    clearRoutes: () => dispatch(clearRoutes()),
    fetchRoutes: () => dispatch(fetchRoutes()),
    placeOrder: payload => dispatch(placeOrder(payload)),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(BottomButtons)
