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

class BottomButtons extends React.Component {
  state = {
    expireProgress: 100,
    validUntil: null,
  }
  componentDidMount() {
    setInterval(() => this.checkRouteExpireProgress(), 1200)
  }

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
            await this.props.cancelActiveOrder()
            Toast.show({
              text: 'Your order has been canceled!',
              buttonText: 'Okay',
              type: 'success',
              duration: 10000,
            })
          },
        },
        {text: 'No'},
      ],
      {cancelable: true}
    )
  }

  fetchRoutes = async () => {
    await this.props.fetchRoutes()
    const validUntil =
      new Date(_.get(this.props.routes, '0.validUntil')).getTime() -
      new Date().getTime()
    this.setState({validUntil: validUntil})
  }

  checkRouteExpireProgress = () => {
    if (!_.get(this.props.routes, '0.validUntil')) return
    let currentDiff =
      new Date(_.get(this.props.routes, '0.validUntil')).getTime() -
      new Date().getTime()
    if (currentDiff <= 0) {
      currentDiff = 0
    }

    const prog = parseInt(
      ((currentDiff / this.state.validUntil) * 100).toFixed(0)
    )
    this.setState({
      expireProgress: prog,
    })
  }

  placeOrder = async () => {
    const validUntil =
      new Date().getTime() -
      new Date(_.get(this.props.routes, '0.validUntil')).getTime()
    if (validUntil > 0) {
      Alert.alert(
        'Route expired',
        'The route has expired and will be recalculate now...'
      )
      return this.props.fetchRoutes()
    }
    Alert.alert(
      'Confirm your order',
      'Do you want to order this route?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await this.props.placeOrder({
              routeId: this.props.routes[0].id,
            })
            Toast.show({
              text: 'Your order has been confirmed!',
              buttonText: 'Okay',
              type: 'success',
              duration: 10000,
            })
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
          },
        },
        {text: 'Cancel'},
      ],
      {cancelable: true}
    )
  }

  render() {
    switch (this.props.mapState) {
      case MapState.INIT:
        return (
          <DestinationButton
            onPress={() => this.props.toSearchView('DESTINATION')}
          />
        )
      case MapState.SEARCH_ROUTES:
        return (
          <>
            <BackButton onPress={() => this.props.resetMapState()} />
            <SearchRoutesButton onPress={() => this.fetchRoutes()} />
          </>
        )
      case MapState.ROUTE_SEARCHED:
        return (
          <>
            <View style={styles.placeOrderButton}>
              <PlaceOrderButton
                routeExpireProgress={this.state.expireProgress}
                onPress={() => this.placeOrder()}
              />
            </View>
            <CancelOrderButton
              onPress={() => {
                this.props.clearRoutes()
                this.zoomToMarkers()
              }}
            />
          </>
        )
      case MapState.ROUTE_ORDERED:
        return (
          <CustomFabWithIcon
            icon="md-close"
            onPress={() => this.cancelActiveOrder()}
            position="topLeft"
          />
        )
    }
    return null
  }
}

const styles = StyleSheet.create({
  placeOrderButton: {
    display: 'flex',
    position: 'absolute',
    left: '40%',
    right: '65%',
    bottom: '16%',
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
