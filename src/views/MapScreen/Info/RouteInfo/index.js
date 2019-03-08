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
import {setVisibleCoordinates} from '../../../../ducks/map'

const RouteInfo = props => {
  const parseDeparture = () => {
    if (!props.routeInfo) return

    const departure = _.get(props.routeInfo, 'vanDepartureTime')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const parseArrival = () => {
    if (!props.routeInfo) return

    const arrival = _.get(props.routeInfo, 'vanArrivalTime')
    const date = moment(arrival)
    return date.format('HH:mm')
  }

  const parseDestinationTime = () => {
    if (!props.routeInfo) return

    const destTime = _.get(props.routeInfo, 'userArrivalTime')
    const date = moment(destTime)
    return date.format('HH:mm')
  }

  const calculateWaitingTime = () => {
    if (!props.routeInfo) return

    const departure = _.get(props.routeInfo, 'vanDepartureTime')
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
    if (!props.routeInfo || !props.map.userStartLocation) return
    console.log('ROUTE INFO:', props.routeInfo)
    console.log('USER START LOCATION:', props.map.userStartLocation)
    const coords = [
      props.map.userStartLocation.location,
      props.routeInfo.vanStartVBS.location,
    ]
    console.log('coords:', coords)
    props.setVisibleCoordinates(coords, edgePadding)
  }

  const zoomToDestinationWalk = () => {
    if (!props.routeInfo || !props.map.userDestinationLocation) return
    console.log('ROUTE INFO:', props.routeInfo)
    console.log('USER DESTINATION LOCATION:', props.map.userDestinationLocation)
    const coords = [
      props.routeInfo.vanEndVBS.location,
      props.map.userDestinationLocation.location,
    ]
    console.log('coords:', coords)
    props.setVisibleCoordinates(coords, edgePadding)
  }

  const zoomToVanRide = () => {
    if (!props.routeInfo) return
    console.log('ROUTE INFO:', props.routeInfo)
    const coords = [
      props.routeInfo.vanStartVBS.location,
      props.routeInfo.vanEndVBS.location,
    ]
    console.log('coords:', coords)
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
          zoomToStartWalk={zoomToStartWalk}
        />
        <VanRideCard
          vanDuration={_.get(
            props.routeInfo,
            'vanRoute.routes.0.legs.0.duration.text'
          )}
          vanDistance={_.get(
            props.routeInfo,
            'vanRoute.routes.0.legs.0.distance.text'
          )}
          departure={parseDeparture()}
          arrival={parseArrival()}
          waitingTime={calculateWaitingTime()}
          busStopEndName={_.get(props.routeInfo, 'vanEndVBS.name')}
        />
        <DestinationWalkCard
          destinationWalkingDuration={_.get(
            props.routeInfo,
            'toDestinationRoute.routes.0.legs.0.duration.text'
          )}
          destinationWalkingDistance={_.get(
            props.routeInfo,
            'toDestinationRoute.routes.0.legs.0.distance.text'
          )}
          destinationTime={parseDestinationTime()}
          destinationName={_.get(props.map, 'userDestinationLocation.title')}
        />
      </Swiper>
    </StyledRouteInfo>
  )
}

const mapStateToProps = state => {
  return {
    map: state.map,
    routeInfo: state.map.routeInfo,
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
  routeInfo: PropTypes.object,
  setVisibleCoordinates: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteInfo)
