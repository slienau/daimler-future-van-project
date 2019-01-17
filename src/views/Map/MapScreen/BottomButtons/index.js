import React from 'react'
import {
  changeMapState,
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
    if (!props.journeyStart || !props.journeyDestination) return
    const coords = [
      props.journeyStart.location,
      props.journeyDestination.location,
    ]
    props.setVisibleCoordinates(coords)
  }

  const cancelActiveOrder = async () => {
    await props.cancelActiveOrder()
    props.changeMapState(MapState.INIT)
  }

  const fetchRoutes = async () => {
    await props.fetchRoutes({
      start: props.journeyStart.location,
      destination: props.journeyDestination.location,
    })
    props.changeMapState(MapState.ROUTE_SEARCHED)
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
            props.changeMapState(MapState.ROUTE_ORDERED)
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
              props.changeMapState(MapState.SEARCH_ROUTES)
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
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
    routes: state.map.routes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeMapState: payload => dispatch(changeMapState(payload)),
    resetMapState: () => dispatch(resetMapState()),
    clearRoutes: () => dispatch(clearRoutes()),
    cancelActiveOrder: () => dispatch(cancelActiveOrder()),
    fetchRoutes: payload => dispatch(fetchRoutes(payload)),
    placeOrder: payload => dispatch(placeOrder(payload)),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomButtons)
