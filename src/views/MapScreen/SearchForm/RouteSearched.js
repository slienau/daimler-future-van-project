import React from 'react'
import {Body, Icon, Left, Right} from 'native-base'
import {
  CardItemBorderBottom,
  CardItemNoBorders,
  TextDarkGray,
  TextBoldBlue,
} from './StyledComponents'
import PropTypes from 'prop-types'

const RouteSearched = props => {
  return (
    <>
      <CardItemBorderBottom>
        <Icon type="MaterialIcons" name="location-on" />
        <TextDarkGray>{props.startText}</TextDarkGray>
        <Right />
      </CardItemBorderBottom>
      <CardItemBorderBottom>
        <Icon type="MaterialCommunityIcons" name="flag-variant" />
        <TextDarkGray>{props.destinationText}</TextDarkGray>
        <Right />
      </CardItemBorderBottom>

      <CardItemNoBorders>
        <Left>
          <Body>
            <TextBoldBlue>Departure: {props.departureTime}</TextBoldBlue>
            <TextBoldBlue note>{props.waitingTime}</TextBoldBlue>
          </Body>
        </Left>
        <Right>
          <TextBoldBlue>Duration: {props.durationTime}</TextBoldBlue>
          <TextBoldBlue>Arrival: {props.arrivalTime}</TextBoldBlue>
        </Right>
      </CardItemNoBorders>
    </>
  )
}

RouteSearched.propTypes = {
  arrivalTime: PropTypes.string,
  destinationText: PropTypes.string,
  durationTime: PropTypes.string,
  startText: PropTypes.string,
  waitingTime: PropTypes.string,
}

export default RouteSearched
