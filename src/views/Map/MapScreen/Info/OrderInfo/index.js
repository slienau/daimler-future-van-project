import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import StartWalkCardLarge from './StartWalkCardLarge'
import DestinationWalkCardLarge from './DestinationWalkCardLarge'
import {StyledOrderInfo} from '../StyledComponents'
import {setVisibleCoordinates, MapState} from '../../../../../ducks/map'

const OrderInfo = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseVanArrival = () => {
    if (!props.routes || !props.routes.length) return

    const arrival = _.get(props.routes[0], 'vanEndTime')
    const date = moment(arrival)
    return date.format('HH:mm')
  }

  // const parseArrival = () => {
  //   if (!props.routes || !props.routes.length) return

  //   const arrival = _.get(props.routes[0], 'vanEndTime')
  //   const date = moment(arrival)
  //   return date.format('HH:mm')
  // }

  const calculateWaitingTime = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const start = moment()
    const end = moment(departure)
    return start.to(end)
  }

  const zoomToStartWalk = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].startLocation,
      props.routes[0].startStation.location,
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
      props.routes[0].endStation.location,
      props.routes[0].destination,
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
          activeOrderState={props.activeOrderState}
          walkingDuration={
            props.routes[0].toStartRoute.routes[0].legs[0].duration.text
          }
          walkingDistance={
            props.routes[0].toStartRoute.routes[0].legs[0].distance.text
          }
          departure={parseDeparture()}
          waitingTime={calculateWaitingTime()}
          busStopStartName={_.get(props.routes[0], 'startStation.name')}
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
          walkingDuration={
            props.routes[0].toDestinationRoute.routes[0].legs[0].duration.text
          }
          walkingDistance={
            props.routes[0].toDestinationRoute.routes[0].legs[0].distance.text
          }
          vanArrival={parseVanArrival()}
          endAddress={_.get(
            props.routes[0].toDestinationRoute.routes[0].legs[0],
            'end_address'
          )}
          vanId={_.get(props.activeOrder, 'vanId')}
          zoomToDestinationWalk={zoomToDestinationWalk}
        />
      )
      break
  }

  return <StyledOrderInfo>{visibleCard}</StyledOrderInfo>
}

OrderInfo.propTypes = {
  activeOrder: PropTypes.object,
  activeOrderState: PropTypes.object,
  currentState: PropTypes.string,
  mapState: PropTypes.string,
  onEnterVanPress: PropTypes.func,
  routes: PropTypes.array,
  setVisibleCoordinates: PropTypes.func,
}

export default connect(
  state => ({
    routes: state.map.routes,
    mapState: state.map.mapState,
    activeOrder: state.orders.activeOrder,
    activeOrderState: state.orders.activeOrderState,
  }),
  dispatch => ({
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(OrderInfo)
