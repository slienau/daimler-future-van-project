import {Text, Icon} from 'native-base'
import {
  CardItemNoBorders,
  StyledContainer,
  IconCenterFlex,
  StyledCardFlex,
  RightAddress,
  LeftFlex,
  BodyFlex,
} from '../StyledComponents'
import React from 'react'
import PropTypes from 'prop-types'

const VanRideCard = props => {
  return (
    <StyledContainer>
      <StyledCardFlex>
        <CardItemNoBorders>
          <LeftFlex>
            <Icon type="MaterialCommunityIcons" name="van-passenger" />
            <BodyFlex>
              <Text>{props.vanDuration}</Text>
              <Text note>{props.vanDistance}</Text>
            </BodyFlex>
            <IconCenterFlex type="Entypo" name="arrow-long-right" />
          </LeftFlex>
          <RightAddress>
            <Text>{props.busStopEndName}</Text>
          </RightAddress>
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
