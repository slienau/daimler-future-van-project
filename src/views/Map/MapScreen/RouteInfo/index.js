import React from 'react'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import {MapState} from '../../../../ducks/map'
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

  const calculateWaitingTime = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const start = moment()
    const end = moment(departure)
    return start.to(end)
  }

  const onSwipe = index => {
    console.log('PROPS', props)
    switch (index) {
      case 0:
        props.zoomToStartWalk()
        break
      case 1:
        props.zoomToVanRide()
        break
      case 2:
        props.zoomToDestinationWalk()
        break
    }
  }

  switch (props.mapState) {
    case MapState.ROUTE_ORDERED:
      return (
        <StyledRouteInfo>
          <Swiper
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
              busStopStartName={_.get(
                props.activeOrder,
                'virtualBusStopStart.name'
              )}
              zoomToStartWalk={props.zoomToStartWalk}
            />
            <VanRideCard />
            <DestinationWalkCard />
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
    activeOrder: state.orders.activeOrder,
  }
}

RouteInfo.propTypes = {
  activeOrder: PropTypes.object,
  map: PropTypes.object,
  mapState: PropTypes.string,
  routes: PropTypes.array,
  zoomToDestinationWalk: PropTypes.func,
  zoomToStartWalk: PropTypes.func,
  zoomToVanRide: PropTypes.func,
}

export default connect(
  mapStateToProps,
  null
)(RouteInfo)
