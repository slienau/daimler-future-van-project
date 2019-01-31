import {Text, Body, Icon, Left, Right} from 'native-base'
import {
  CardItemNoBorders,
  StyledContainer,
  IconCenterFlex,
  StyledCardFlex,
} from '../StyledComponents'
import React from 'react'
import PropTypes from 'prop-types'

const VanRideCard = props => {
  return (
    <StyledContainer>
      <StyledCardFlex>
        <CardItemNoBorders>
          <Left>
            <Icon type="MaterialCommunityIcons" name="van-passenger" />
            <Body>
              <Text>{props.vanDuration}</Text>
              <Text note>{props.vanDistance}</Text>
            </Body>
          </Left>
          <IconCenterFlex type="Entypo" name="arrow-long-right" />
          <Right>
            <Text>{props.busStopEndName}</Text>
          </Right>
        </CardItemNoBorders>
        {/* <CardItemNoBorders>
            <Body>
              <Text>Van departure: {props.departure}</Text>
              <TextGreen note>{props.waitingTime}</TextGreen>
            </Body>
            <Right>
              <Body>
                <Text>Van arrival: {props.arrival}</Text>
              </Body>
            </Right>
          </CardItemNoBorders> */}
      </StyledCardFlex>
    </StyledContainer>
  )
}

VanRideCard.propTypes = {
  busStopEndName: PropTypes.string,
  vanDistance: PropTypes.string,
  vanDuration: PropTypes.string,
}

export default VanRideCard
