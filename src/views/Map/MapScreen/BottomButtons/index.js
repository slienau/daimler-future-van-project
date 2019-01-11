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
import {cancelOrder} from '../../../../ducks/orders'

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

  const cancelOrder = async () => {
    await props.cancelOrder({
      id: props.activeOrder._id,
    })
    props.changeMapState(MapState.INIT)
  }

  const fetchRoutes = async () => {
    await props.fetchRoutes({
      start: props.journeyStart.location,
      destination: props.journeyDestination.location,
    })
    props.changeMapState(MapState.ROUTE_SEARCHED)
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
          <PlaceOrderButton onPress={() => props.placeOrder()} />
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
          <CancelOrderButton onPress={() => cancelOrder()} />
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
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeMapState: payload => dispatch(changeMapState(payload)),
    resetMapState: () => dispatch(resetMapState()),
    clearRoutes: () => dispatch(clearRoutes()),
    cancelOrder: payload => dispatch(cancelOrder(payload)),
    fetchRoutes: payload => dispatch(fetchRoutes(payload)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomButtons)
