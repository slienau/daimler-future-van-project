import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import {MapState, changeMapState, clearRoutes} from '../../../../ducks/map'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import StartWalkCard from './StartWalkCard'
import VanRideCard from './VanRideCard'
import DestinationWalkCard from './DestinationWalkCard'
import {StyledRouteInfo} from './StyledComponents'

const RouteInfo = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseArrival = () => {
    if (!props.routes || !props.routes.length) return

    const arrival = _.get(props.routes[0], 'vanEndTime')
    const date = moment(arrival)
    return date.format('HH:mm')
  }

  const parseDestinationTime = () => {
    if (!props.routes || !props.routes.length) return

    const destTime = _.get(props.routes[0], 'destinationTime')
    const date = moment(destTime)
    return date.format('HH:mm')
  }

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
    props.fitToCoordinates(coords, {
      top: 600,
      right: 100,
      left: 100,
      bottom: 350,
    })
  }

  const zoomToDestinationWalk = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].endStation.location,
      props.routes[0].destination,
    ]
    props.fitToCoordinates(coords, {
      top: 600,
      right: 100,
      left: 100,
      bottom: 350,
    })
  }

  const zoomToVanRide = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].startStation.location,
      props.routes[0].endStation.location,
    ]
    props.fitToCoordinates(coords, {
      top: 600,
      right: 100,
      left: 100,
      bottom: 350,
    })
  }

  const onSwipe = index => {
    switch (index) {
      case 0:
        zoomToStartWalk()
        break
      case 1:
        zoomToVanRide()
        break
      case 2:
        zoomToDestinationWalk()
        break
    }
  }

  switch (props.mapState) {
    case MapState.ROUTE_SEARCHED:
      return (
        <StyledRouteInfo>
          <Swiper
            loop={false}
            index={1}
            showsButtons={false}
            onIndexChanged={index => {
              onSwipe(index)
            }}>
            <StartWalkCard
              walkingDuration={
                props.routes[0].toStartRoute.routes[0].legs[0].duration.text
              }
              walkingDistance={
                props.routes[0].toStartRoute.routes[0].legs[0].distance.text
              }
              departure={parseDeparture()}
              waitingTime={calculateWaitingTime()}
              busStopStartName={_.get(props.routes[0], 'startStation.name')}
              zoomToStartWalk={props.zoomToStartWalk}
            />
            <VanRideCard
              vanDuration={
                props.routes[0].vanRoute.routes[0].legs[0].duration.text
              }
              vanDistance={
                props.routes[0].vanRoute.routes[0].legs[0].distance.text
              }
              departure={parseDeparture()}
              arrival={parseArrival()}
              waitingTime={calculateWaitingTime()}
              busStopEndName={_.get(props.routes[0], 'endStation.name')}
            />
            <DestinationWalkCard
              destinationWalkingDuration={
                props.routes[0].toDestinationRoute.routes[0].legs[0].duration
                  .text
              }
              destinationWalkingDistance={
                props.routes[0].toDestinationRoute.routes[0].legs[0].distance
                  .text
              }
              destinationTime={parseDestinationTime()}
              destinationName={props.map.journeyDestination.title}
            />
          </Swiper>
        </StyledRouteInfo>
      )
    default:
      return null
  }
}

const mapStateToProps = state => {
  return {
    map: state.map,
    mapState: state.map.mapState,
    routes: state.map.routes,
  }
}

const mapDispatchToProps = dispatch => ({
  onChangeMapState: payload => dispatch(changeMapState(payload)),
  onClearRoutes: () => dispatch(clearRoutes()),
})

RouteInfo.propTypes = {
  fitToCoordinates: PropTypes.func,
  map: PropTypes.object,
  mapState: PropTypes.string,
  onChangeMapState: PropTypes.func,
  onClearRoutes: PropTypes.func,
  routes: PropTypes.array,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteInfo)
