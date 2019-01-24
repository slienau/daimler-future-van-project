import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import StartWalkCard from './StartWalkCard'
import VanRideCard from './VanRideCard'
import DestinationWalkCard from './DestinationWalkCard'
import {StyledRouteInfo} from '../StyledComponents'
import {setVisibleCoordinates} from '../../../../../ducks/map'

const RouteInfo = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanETAatStartVBS')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseArrival = () => {
    if (!props.routes || !props.routes.length) return

    const arrival = _.get(props.routes[0], 'vanETAatEndVBS')
    const date = moment(arrival)
    return date.format('HH:mm')
  }

  const parseDestinationTime = () => {
    if (!props.routes || !props.routes.length) return

    const destTime = _.get(props.routes[0], 'userETAatUserDestinationLocation')
    const date = moment(destTime)
    return date.format('HH:mm')
  }

  const calculateWaitingTime = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanETAatStartVBS')
    const start = moment()
    const end = moment(departure)
    return start.to(end)
  }

  const edgePadding = {
    top: 0.33,
    right: 0.1,
    left: 0.1,
    bottom: 0.2,
  }

  const zoomToStartWalk = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].userStartLocation,
      props.routes[0].vanStartVBS.location,
    ]
    props.setVisibleCoordinates(coords, edgePadding)
  }

  const zoomToDestinationWalk = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].vanEndVBS.location,
      props.routes[0].userDestinationLocation,
    ]
    props.setVisibleCoordinates(coords, edgePadding)
  }

  const zoomToVanRide = () => {
    if (!props.routes || !props.routes.length) return
    const coords = [
      props.routes[0].vanStartVBS.location,
      props.routes[0].vanEndVBS.location,
    ]
    props.setVisibleCoordinates(coords, edgePadding)
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
          busStopStartName={_.get(props.routes[0], 'vanStartVBS.name')}
          zoomToStartWalk={zoomToStartWalk}
        />
        <VanRideCard
          vanDuration={props.routes[0].vanRoute.routes[0].legs[0].duration.text}
          vanDistance={props.routes[0].vanRoute.routes[0].legs[0].distance.text}
          departure={parseDeparture()}
          arrival={parseArrival()}
          waitingTime={calculateWaitingTime()}
          busStopEndName={_.get(props.routes[0], 'vanEndVBS.name')}
        />
        <DestinationWalkCard
          destinationWalkingDuration={
            props.routes[0].toDestinationRoute.routes[0].legs[0].duration.text
          }
          destinationWalkingDistance={
            props.routes[0].toDestinationRoute.routes[0].legs[0].distance.text
          }
          destinationTime={parseDestinationTime()}
          destinationName={props.map.userDestinationLocation.title}
        />
      </Swiper>
    </StyledRouteInfo>
  )
}

const mapStateToProps = state => {
  return {
    map: state.map,
    routes: state.map.routes,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  }
}

RouteInfo.propTypes = {
  map: PropTypes.object,
  routes: PropTypes.array,
  setVisibleCoordinates: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteInfo)
