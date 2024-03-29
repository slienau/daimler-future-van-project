import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import StartWalkCardLarge from './StartWalkCardLarge'
import DestinationWalkCardLarge from './DestinationWalkCardLarge'
import {StyledOrderInfo} from '../StyledComponents'
import {setVisibleCoordinates, OrderState} from '../../../../../ducks/map'

const OrderInfo = props => {
  const parseDeparture = () => {
    if (!props.routeInfo) return

    const departure = _.get(props.routeInfo, 'vanDepartureTime')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseDestArrival = () => {
    if (!props.activeOrder) return
    const arrival = _.get(props.routeInfo, 'userArrivalTime')
    return moment(arrival).format('HH:mm')
  }

  // const parseArrival = () => {
  //   if (!props.routeInfo) return

  //   const arrival = _.get(props.routeInfo, 'vanArrivalTime')
  //   const date = moment(arrival)
  //   return date.format('HH:mm')
  // }

  const calculateWaitingTime = () => {
    if (!props.routeInfo) return

    const departure = _.get(props.routeInfo, 'vanDepartureTime')
    const start = moment()
    const end = moment(departure)
    return start.to(end)
  }

  const zoomToStartWalk = () => {
    if (!props.routeInfo || !props.map.userStartLocation) return
    const coords = [
      props.map.userStartLocation.location,
      _.get(props.routeInfo, 'vanStartVBS.location'),
    ]
    props.setVisibleCoordinates(coords, {
      top: 0.2,
      right: 0.15,
      left: 0.15,
      bottom: 0.4,
    })
  }

  const zoomToDestinationWalk = () => {
    if (!props.routeInfo || !props.map.userDestinationLocation) return
    const coords = [
      _.get(props.routeInfo, 'vanEndVBS.location'),
      props.map.userDestinationLocation.location,
    ]
    props.setVisibleCoordinates(coords, {
      top: 0.2,
      right: 0.15,
      left: 0.15,
      bottom: 0.4,
    })
  }

  let visibleCard = null
  switch (props.orderState) {
    case OrderState.ROUTE_ORDERED:
      visibleCard = (
        <StartWalkCardLarge
          currentState={props.currentState}
          onEnterVanPress={props.onEnterVanPress}
          activeOrderStatus={props.activeOrderStatus}
          walkingDuration={_.get(
            props.routeInfo,
            'toStartRoute.routes.0.legs.0.duration.text'
          )}
          walkingDistance={_.get(
            props.routeInfo,
            'toStartRoute.routes.0.legs.0.distance.text'
          )}
          departure={parseDeparture()}
          waitingTime={calculateWaitingTime()}
          busStopStartName={_.get(props.routeInfo, 'vanStartVBS.name')}
          vanId={_.get(props.activeOrder, 'vanId')}
          zoomToStartWalk={zoomToStartWalk}
          zoomToDestinationWalk={zoomToDestinationWalk}
        />
      )
      break
    case OrderState.EXIT_VAN:
      visibleCard = (
        <DestinationWalkCardLarge
          walkingDuration={_.get(
            props.routeInfo,
            'toDestinationRoute.routes.0.legs.0.duration.text'
          )}
          walkingDistance={_.get(
            props.routeInfo,
            'toDestinationRoute.routes.0.legs.0.distance.text'
          )}
          destArrival={parseDestArrival()}
          endAddress={_.get(
            props.routeInfo,
            'toDestinationRoute.routes.0.legs.0.end_address'
          )}
          currentUserLocation={props.currentUserLocation}
          destinationLocation={_.get(
            props.routeInfo,
            'toDestinationRoute.routes.0.legs.0.end_location'
          )}
          zoomToDestinationWalk={zoomToDestinationWalk}
        />
      )
      break
  }

  return <StyledOrderInfo>{visibleCard}</StyledOrderInfo>
}

OrderInfo.propTypes = {
  activeOrder: PropTypes.object,
  activeOrderStatus: PropTypes.object,
  currentState: PropTypes.string,
  currentUserLocation: PropTypes.object,
  map: PropTypes.object,
  onEnterVanPress: PropTypes.func,
  orderState: PropTypes.string,
  routeInfo: PropTypes.object,
  setVisibleCoordinates: PropTypes.func,
}

export default connect(
  state => ({
    map: state.map,
    routeInfo: state.map.routeInfo,
    currentUserLocation: state.map.currentUserLocation,
    orderState: state.map.orderState,
    activeOrder: state.orders.activeOrder,
    activeOrderStatus: state.orders.activeOrderStatus,
  }),
  dispatch => ({
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(OrderInfo)
