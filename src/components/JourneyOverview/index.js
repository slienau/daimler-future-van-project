import React from 'react'
import {View} from 'native-base'
import JourneyListItem from './JourneyListItem'

const JourneyOverview = props => {
  return (
    <View>
      <JourneyListItem
        description="Time of arrival"
        iconColor="darkgreen"
        iconName="flag"
        info="15:00 PM"
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
export default JourneyOverview
