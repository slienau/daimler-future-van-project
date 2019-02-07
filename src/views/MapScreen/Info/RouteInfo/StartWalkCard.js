import {Text, Icon} from 'native-base'
import PropTypes from 'prop-types'
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

const StartWalkCard = props => {
  return (
    <StyledContainer>
      <StyledCardFlex>
        <CardItemNoBorders>
          <LeftFlex>
            <Icon name="walk" />
            <BodyFlex>
              <Text>{props.walkingDuration}</Text>
              <Text note>{props.walkingDistance}</Text>
            </BodyFlex>
            <IconCenterFlex type="Entypo" name="arrow-long-right" />
          </LeftFlex>
          <RightAddress>
            <Text>{props.busStopStartName}</Text>
          </RightAddress>
        </CardItemNoBorders>
        {/* <CardItemNoBorders>
          <Body>
            <TextBoldBlue>Van departure: {props.departure}</TextBoldBlue>
            <TextBoldBlue note>{props.waitingTime}</TextBoldBlue>
          </Body>
        </CardItemNoBorders> */}
      </StyledCardFlex>
    </StyledContainer>
  )
}

StartWalkCard.propTypes = {
  busStopStartName: PropTypes.string,
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
}

export default StartWalkCard
