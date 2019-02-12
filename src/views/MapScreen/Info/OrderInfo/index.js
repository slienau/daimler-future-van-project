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
    if (!props.routeInfo) return

    const departure = _.get(props.routeInfo, 'vanETAatStartVBS')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseDestArrival = () => {
    if (!props.activeOrder) return
    const arrival = _.get(
      props.activeOrder,
      'route.userETAatUserDestinationLocation'
    )
    return moment(arrival).format('HH:mm')
  }

  // const parseArrival = () => {
  //   if (!props.routeInfo) return

  //   const arrival = _.get(props.routeInfo, 'vanETAatEndVBS')
  //   const date = moment(arrival)
  //   return date.format('HH:mm')
  // }

  const calculateWaitingTime = () => {
    if (!props.routeInfo) return

    const departure = _.get(props.routeInfo, 'vanETAatStartVBS')
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
  switch (props.mapState) {
    case MapState.ROUTE_ORDERED:
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
    case MapState.EXIT_VAN:
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
  mapState: PropTypes.string,
  onEnterVanPress: PropTypes.func,
  routeInfo: PropTypes.object,
  setVisibleCoordinates: PropTypes.func,
}

export default connect(
  state => ({
    map: state.map,
    routeInfo: state.map.routeInfo,
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
