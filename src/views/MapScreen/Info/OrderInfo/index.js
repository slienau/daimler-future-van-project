import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import StartWalkCardLarge from './StartWalkCardLarge'
import DestinationWalkCardLarge from './DestinationWalkCardLarge'
import {StyledOrderInfo} from '../StyledComponents'
import {setVisibleCoordinates, MapState} from '../../../../ducks/map'

const OrderInfo = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes, '0.vanETAatStartVBS')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseVanArrival = () => {
    if (!props.routes || !props.routes.length) return

    const arrival = _.get(props.routes, '0.vanETAatEndVBS')
    const date = moment(arrival)
    return date.format('HH:mm')
  }

  // const parseArrival = () => {
  //   if (!props.routes || !props.routes.length) return

  //   const arrival = _.get(props.routes[0], 'vanETAatEndVBS')
  //   const date = moment(arrival)
  //   return date.format('HH:mm')
  // }

  const calculateWaitingTime = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanETAatStartVBS')
    const start = moment()
    const end = moment(departure)
    return start.to(end)
  }

  const zoomToStartWalk = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].userStartLocation,
      props.routes[0].vanStartVBS.location,
    ]
    props.setVisibleCoordinates(coords, {
      top: 0.2,
      right: 0.15,
      left: 0.15,
      bottom: 0.4,
    })
  }

  const zoomToDestinationWalk = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].vanEndVBS.location,
      props.routes[0].userDestinationLocation,
    ]
    props.setVisibleCoordinates(coords, {
      top: 0.2,
      right: 0.15,
      left: 0.15,
      bottom: 0.4,
    })
  }

  let visibleCard = null
  switch (props.mapState) {
    case MapState.ROUTE_ORDERED:
      visibleCard = (
        <StartWalkCardLarge
          currentState={props.currentState}
          onEnterVanPress={props.onEnterVanPress}
          activeOrderStatus={props.activeOrderStatus}
          walkingDuration={
            props.routes[0].toStartRoute.routes[0].legs[0].duration.text
          }
          walkingDistance={
            props.routes[0].toStartRoute.routes[0].legs[0].distance.text
          }
          departure={parseDeparture()}
          waitingTime={calculateWaitingTime()}
          busStopStartName={_.get(props.routes[0], 'vanStartVBS.name')}
          vanId={_.get(props.activeOrder, 'vanId')}
          zoomToStartWalk={zoomToStartWalk}
          zoomToDestinationWalk={zoomToDestinationWalk}
        />
      )
      break
    case MapState.EXIT_VAN:
      console.log(props.routes[0])
      visibleCard = (
        <DestinationWalkCardLarge
          toMapScreen={props.toMapScreen}
          walkingDuration={_.get(
            props.routes,
            '0.toDestinationRoute.routes.0.legs.0.duration.text'
          )}
          walkingDistance={_.get(
            props.routes,
            '0.toDestinationRoute.routes.0.legs.0.distance.text'
          )}
          vanArrival={parseVanArrival()}
          endAddress={_.get(
            props.routes,
            '0.toDestinationRoute.routes.0.legs.0.end_address'
          )}
          vanId={_.get(props.activeOrder, 'vanId')}
          currentUserLocation={props.currentUserLocation}
          destinationLocation={_.get(
            props.routes,
            '0.toDestinationRoute.routes.0.legs.0.end_location'
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
  mapState: PropTypes.string,
  onEnterVanPress: PropTypes.func,
  routes: PropTypes.array,
  setVisibleCoordinates: PropTypes.func,
  toMapScreen: PropTypes.func,
}

export default connect(
  state => ({
    routes: state.map.routes,
    currentUserLocation: state.map.currentUserLocation,
    mapState: state.map.mapState,
    activeOrder: state.orders.activeOrder,
    activeOrderStatus: state.orders.activeOrderStatus,
  }),
  dispatch => ({
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(OrderInfo)
