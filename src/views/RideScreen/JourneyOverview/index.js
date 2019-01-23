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
  const getdestinationTime = _.get(props.route, 'destinationTime')
  const destinationTime = moment(getdestinationTime).format('HH:mm')

  const getVanArrivalTime = _.get(props.route, 'vanEndTime')
  const vanArrivalTime = moment(getVanArrivalTime).format('HH:mm')
  const bonusPoints = '' + _.round(_.get(props.activeOrder, 'bonuspoints'), 2)

  return (
    <>
      <ListItem itemHeader first>
        <StyledText>Journey overview</StyledText>
      </ListItem>
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
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
    route: _.get(state.map, 'routes.0'),
  }
}

export default connect(mapStateToProps)(JourneyOverview)
