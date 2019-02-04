import React from 'react'
import JourneyListItem from './JourneyListItem'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'

const JourneyOverview = props => {
  const userETAatUserDestinationLocation = moment(
    _.get(props.route, 'userETAatUserDestinationLocation')
  ).format('HH:mm')

  const vanETAatEndVBS = moment(_.get(props.route, 'vanETAatEndVBS')).format(
    'HH:mm'
  )
  const loyaltyPoints =
    '' + _.round(_.get(props.activeOrder, 'loyaltyPoints'), 2)

  return (
    <>
      <JourneyListItem
        description="Time of arrival"
        iconColor="darkgreen"
        iconName="flag"
        info={userETAatUserDestinationLocation}
        vanEndTime // TODO: kann weg?
      />
      <JourneyListItem
        description="Time of arrival of exit point"
        iconColor="darkblue"
        iconName="bus"
        info={vanETAatEndVBS}
      />
      <JourneyListItem
        description="Overall Kilometers"
        iconColor="black"
        iconName="speedometer"
        info="4.23 Km" // TODO: show kilometers from order / route?
      />
      <JourneyListItem
        description="Bonus Points"
        iconColor="orange"
        iconName="star"
        info={loyaltyPoints}
      />
    </>
  )
}

JourneyOverview.propTypes = {
  activeOrder: PropTypes.object,
  route: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
    mapState: state.map.mapState,
    userStartLocation: state.map.userStartLocation,
    userDestinationLocation: state.map.userDestinationLocation,
    route: _.get(state.map, 'routes.0'),
  }
}

export default connect(mapStateToProps)(JourneyOverview)
