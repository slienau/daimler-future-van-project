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

class BottomButtons extends React.Component {
  state = {
    routeExipreProgress: 0,
  }
  componentDidMount() {
    setInterval(() => this.checkRouteExpireProgress(), 1000)
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
  }

  checkRouteExpireProgress = () => {
    if (!_.get(this.props.routes, '0.validUntil')) return
    const validUntil =
      new Date(_.get(this.props.routes, '0.validUntil')).getTime() -
      new Date().getTime()
    this.setState({routeExipreProgress: (60000 - validUntil) / 600})
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
                routeExipreProgress={this.state.routeExipreProgress}
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
          <CancelOrderButton
            bottom="88%"
            iconName="close"
            onPress={() => this.cancelActiveOrder()}
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
    left: '45%',
    right: '45%',
    bottom: '15%',
  },
})

BottomButtons.propTypes = {
  cancelActiveOrder: PropTypes.func,
  clearRoutes: PropTypes.func,
  fetchRoutes: PropTypes.func,
  mapState: PropTypes.string,
  placeOrder: PropTypes.func,
  resetMapState: PropTypes.func,
  routes: PropTypes.object,
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
