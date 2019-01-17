import React from 'react'
import {View} from 'native-base'
import JourneyListItem from './JourneyListItem'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'

const JourneyOverview = props => {
  const getdestinationTime = _.get(props.routes[0], 'destinationTime')
  const destinationTime = moment(getdestinationTime).format('HH:mm')

  const getVanArrivalTime = _.get(props.routes[0], 'vanEndTime')
  const vanArrivalTime = moment(getVanArrivalTime).format('HH:mm')
  const bonusPoints = _.round(_.get(props.activeOrder, 'bonuspoints'), 2)

  return (
    <View>
      <JourneyListItem
        description="Time of arrival"
        iconColor="darkgreen"
        iconName="flag"
        info={destinationTime}
        vanEndTime
      />
      <JourneyListItem
        description="Time of arrival of exit point"
        iconColor="darkblue"
        iconName="bus"
        info={vanArrivalTime}
      />
      <JourneyListItem
        description="Overall Kilometers"
        iconColor="black"
        iconName="speedometer"
        info="4.23 Km"
      />
      <JourneyListItem
        description="Bonus Points"
        iconColor="orange"
        iconName="star"
        info={bonusPoints}
      />
    </View>
  )
}

JourneyOverview.propTypes = {
  activeOrder: PropTypes.object,
  routes: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
    mapState: state.map.mapState,
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
    routes: state.map.routes,
  }
}

export default connect(mapStateToProps)(JourneyOverview)
