import React from 'react'
import {
  changeMapState,
  clearRoutes,
  MapState,
  resetMapState,
  fetchRoutes,
} from '../../../../ducks/map'
import {connect} from 'react-redux'
import DestinationButton from './DestinationButton'
import BackButton from './BackButton'
import SearchRoutesButton from './SearchRoutesButton'
import PlaceOrderButton from './PlaceOrderButton'
import CancelOrderButton from './CancelOrderButton'
import {cancelActiveOrder, placeOrder} from '../../../../ducks/orders'

const BottomButtons = props => {
  const zoomToMarkers = () => {
    if (!props.journeyStart || !props.journeyDestination) return
    const coords = [
      props.journeyStart.location,
      props.journeyDestination.location,
    ]
    props.fitToCoordinates(coords, {
      top: 35,
      right: 100,
      left: 100,
      bottom: 350,
    })
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
    await props.placeOrder({
      start: props.routes[0].startStation._id,
      destination: props.routes[0].endStation._id,
      vanId: props.routes[0].vanId,
    })
    props.changeMapState(MapState.ROUTE_ORDERED)
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
        <>
          <CancelOrderButton onPress={() => cancelActiveOrder()} />
        </>
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
    cancelActiveOrder: payload => dispatch(cancelActiveOrder(payload)),
    fetchRoutes: payload => dispatch(fetchRoutes(payload)),
    placeOrder: payload => dispatch(placeOrder(payload)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomButtons)
