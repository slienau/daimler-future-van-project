import React from 'react'
import {
  clearRoutes,
  MapState,
  resetMapState,
  fetchRoutes,
  setVisibleCoordinates,
} from '../../../../ducks/map'
import {connect} from 'react-redux'
import DestinationButton from './DestinationButton'
import BackButton from './BackButton'
import SearchRoutesButton from './SearchRoutesButton'
import PlaceOrderButton from './PlaceOrderButton'
import CancelOrderButton from './CancelOrderButton'
import {cancelActiveOrder, placeOrder} from '../../../../ducks/orders'
import {Alert} from 'react-native'
import {Toast} from 'native-base'

const BottomButtons = props => {
  const zoomToMarkers = () => {
    if (!props.userStartLocation || !props.userDestinationLocation) return
    const coords = [
      props.userStartLocation.location,
      props.userDestinationLocation.location,
    ]
    props.setVisibleCoordinates(coords)
  }

  const cancelActiveOrder = async () => {
    Alert.alert(
      'Cancel your order',
      'Do you want to cancel your current order?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await props.cancelActiveOrder()
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

  const fetchRoutes = async () => {
    await props.fetchRoutes()
  }

  const placeOrder = async () => {
    Alert.alert(
      'Confirm your order',
      'Do you want to order this route?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await props.placeOrder({
              routeId: props.routes[0].id,
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

  let visibleButtons = null
  switch (props.mapState) {
    case MapState.INIT:
      visibleButtons = (
        <DestinationButton onPress={() => props.toSearchView('DESTINATION')} />
      )
      break
    case MapState.SEARCH_ROUTES:
      visibleButtons = (
        <>
          <BackButton onPress={() => props.resetMapState()} />
          <SearchRoutesButton onPress={() => fetchRoutes()} />
        </>
      )
      break
    case MapState.ROUTE_SEARCHED:
      visibleButtons = (
        <>
          <PlaceOrderButton onPress={() => placeOrder()} />
          <CancelOrderButton
            onPress={() => {
              props.clearRoutes()
              zoomToMarkers()
            }}
          />
        </>
      )
      break
    case MapState.ROUTE_ORDERED:
      visibleButtons = (
        <CancelOrderButton
          bottom="88%"
          iconName="close"
          onPress={() => cancelActiveOrder()}
        />
      )
      break
    case MapState.ORDER_CANCELLED:
      visibleButtons = <></>
      break
  }

  return visibleButtons
}

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
    mapState: state.map.mapState,
    userStartLocation: state.map.userStartLocation,
    userDestinationLocation: state.map.userDestinationLocation,
    routes: state.map.routes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetMapState: () => dispatch(resetMapState()),
    clearRoutes: () => dispatch(clearRoutes()),
    cancelActiveOrder: () => dispatch(cancelActiveOrder()),
    fetchRoutes: () => dispatch(fetchRoutes()),
    placeOrder: payload => dispatch(placeOrder(payload)),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomButtons)
