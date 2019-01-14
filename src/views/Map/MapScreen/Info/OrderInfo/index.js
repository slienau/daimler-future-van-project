import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import StartWalkCardLarge from './StartWalkCardLarge'
import {StyledOrderInfo} from '../StyledComponents'

const OrderInfo = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const date = moment(departure)
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
    props.fitToCoordinates(coords, {
      top: 600,
      right: 100,
      left: 100,
      bottom: 450,
    })
  }

  // const zoomToDestinationWalk = () => {
  //   if (!props.routes || !props.routes.length) return
  //   const coords = [
  //     props.routes[0].endStation.location,
  //     props.routes[0].destination,
  //   ]
  //   props.fitToCoordinates(coords, {
  //     top: 600,
  //     right: 100,
  //     left: 100,
  //     bottom: 450,
  //   })
  // }

  return (
    <StyledOrderInfo>
      <StartWalkCardLarge
        walkingDuration={
          props.routes[0].toStartRoute.routes[0].legs[0].duration.text
        }
        walkingDistance={
          props.routes[0].toStartRoute.routes[0].legs[0].distance.text
        }
        departure={parseDeparture()}
        waitingTime={calculateWaitingTime()}
        busStopStartName={_.get(props.routes[0], 'startStation.name')}
        zoomToStartWalk={zoomToStartWalk}
      />
    </StyledOrderInfo>
  )
}

const mapStateToProps = state => {
  return {
    routes: state.map.routes,
  }
}

OrderInfo.propTypes = {
  fitToCoordinates: PropTypes.func,
  routes: PropTypes.array,
}

export default connect(
  mapStateToProps,
  null
)(OrderInfo)
