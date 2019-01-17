import {Text, Body, Icon, Left, Right} from 'native-base'
import PropTypes from 'prop-types'
import {
  StyledCard,
  CardItemNoBorders,
  StyledContainer,
  IconCenterFlex,
} from '../StyledComponents'
import React from 'react'

const StartWalkCard = props => {
  return (
    <StyledContainer>
      <StyledCard>
        <CardItemNoBorders>
          <Left>
            <Icon name="walk" />
            <Body>
              <Text>{props.walkingDuration}</Text>
              <Text note>{props.walkingDistance}</Text>
            </Body>
          </Left>
          <IconCenterFlex type="Entypo" name="arrow-long-right" />
          <Right>
            <Text>{props.busStopStartName}</Text>
          </Right>
        </CardItemNoBorders>
        {/* <CardItemNoBorders>
          <Body>
            <TextBoldBlue>Van departure: {props.departure}</TextBoldBlue>
            <TextBoldBlue note>{props.waitingTime}</TextBoldBlue>
          </Body>
        </CardItemNoBorders> */}
      </StyledCard>
    </StyledContainer>
  )
}

StartWalkCard.propTypes = {
  busStopStartName: PropTypes.string,
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
}

export default StartWalkCard
