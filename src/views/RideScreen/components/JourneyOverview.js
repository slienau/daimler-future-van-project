import React from 'react'
import JourneyListItem from './JourneyListItem'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import CustomListItemHeader from '../../../components/UI/CustomListItemHeader'

const JourneyOverview = props => {
  const userETAatUserDestinationLocation = moment(
    _.get(props.routeInfo, 'userETAatUserDestinationLocation')
  ).format('LT')

  const loyaltyPoints =
    '' + _.round(_.get(props.activeOrder, 'loyaltyPoints'), 2)

  return (
    <>
      <CustomListItemHeader title="Journey Overview" />
      <JourneyListItem
        description="Time of arrival at destination"
        iconColor="darkgreen"
        iconName="flag"
        info={userETAatUserDestinationLocation}
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

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
    activeOrderStatus: state.orders.activeOrderStatus,
    routeInfo: state.map.routeInfo,
  }
}

export default connect(mapStateToProps)(JourneyOverview)
