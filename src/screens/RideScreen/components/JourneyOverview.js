import React from 'react'
import JourneyListItem from './JourneyListItem'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import DefaultListItemHeader from '../../../components/UI/DefaultListItemHeader'

const JourneyOverview = props => {
  const userArrivalTime = moment(
    _.get(props.routeInfo, 'userArrivalTime')
  ).format('LT')

  const guaranteedUserArrivalTime = moment(
    _.get(props.routeInfo, 'guaranteedUserArrivalTime')
  ).format('LT')

  const loyaltyPoints =
    '' + _.round(_.get(props.activeOrder, 'loyaltyPoints'), 2)

  return (
    <>
      <DefaultListItemHeader title="Journey Overview" />
      <JourneyListItem
        description="Time of arrival at destination"
        iconColor="darkgreen"
        iconName="flag"
        info={userArrivalTime}
      />
      <JourneyListItem
        description="Guaranteed time of arrival at destination"
        iconColor="darkred"
        iconName="flag"
        info={guaranteedUserArrivalTime}
      />
      <JourneyListItem
        description="Total distance"
        iconColor="black"
        iconName="speedometer"
        info={_.get(props.activeOrder, 'distance') + ' Km'}
      />
      <JourneyListItem
        description="Loyalty points"
        iconColor="orange"
        iconName="star"
        info={loyaltyPoints}
      />
    </>
  )
}

JourneyOverview.propTypes = {
  activeOrder: PropTypes.object,
  activeOrderStatus: PropTypes.object,
  routeInfo: PropTypes.object,
}

export default connect(state => {
  return {
    activeOrder: state.orders.activeOrder,
    activeOrderStatus: state.orders.activeOrderStatus,
    routeInfo: state.map.routeInfo,
  }
})(JourneyOverview)
