import React from 'react'
import {View, Text} from 'native-base'
import JourneyListItem from './JourneyListItem'
import {connect} from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'

const JourneyOverview = props => {
  let checker = null
  if (!props.activeOrder) checker = <Text>Active Order null</Text>
  return (
    <View>
      {checker}
      <Text>{_.get(props.journeyStart, 'title')}</Text>
      <Text>{_.get(props.journeyDestination, 'description')}</Text>
      <Text>{_.get(props.activeOrder, 'name')}</Text>
      <JourneyListItem
        description="Time of arrival"
        iconColor="darkgreen"
        iconName="flag"
        info="bla"
      />
      <JourneyListItem
        description="Time of arrival of exit point"
        iconColor="darkblue"
        iconName="bus"
        info="14:43 PM"
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
        info="5 Points"
      />
    </View>
  )
}

JourneyOverview.propTypes = {
  activeOrder: PropTypes.object,
  journeyDestination: PropTypes.object,
  journeyStart: PropTypes.object,
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
