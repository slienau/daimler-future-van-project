import React from 'react'
import {ListItem, Text} from 'native-base'
import JourneyListItem from './JourneyListItem'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'

const StyledText = styled(Text)`
  font-size: 21;
`

const JourneyOverview = props => {
  const userETAatUserDestinationLocation = moment(
    _.get(props.activeOrder, 'route.userETAatUserDestinationLocation')
  ).format('HH:mm')

  const vanETAatEndVBS = moment(
    _.get(props.activeOrderStatus, 'vanETAatDestinationVBS')
  ).format('HH:mm')
  const loyaltyPoints =
    '' + _.round(_.get(props.activeOrder, 'loyaltyPoints'), 2)

  return (
    <>
      <ListItem itemHeader first>
        <StyledText>Journey overview</StyledText>
      </ListItem>
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
  activeOrderStatus: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
    activeOrderStatus: state.orders.activeOrderStatus,
  }
}

export default connect(mapStateToProps)(JourneyOverview)
