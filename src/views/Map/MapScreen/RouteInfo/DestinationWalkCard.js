import {Text, Body, Icon, Left, Right} from 'native-base'
import {
  StyledCard,
  CardItemNoBorders,
  StyledContainer,
  IconCenterFlex,
} from './StyledComponents'
import React from 'react'
import PropTypes from 'prop-types'

const DestinationWalkCard = props => {
  return (
    <StyledContainer>
      <StyledCard>
        <CardItemNoBorders>
          <Left>
            <Icon name="walk" />
            <Body>
              <Text>{props.destinationWalkingDuration}</Text>
              <Text note>{props.destinationWalkingDistance}</Text>
            </Body>
          </Left>
          <IconCenterFlex type="Entypo" name="arrow-long-right" />
          <Right>
            <Text>{props.destinationName}</Text>
          </Right>
        </CardItemNoBorders>
        {/* <CardItemNoBorders>
            <Body>
              <Text>Arrival: {props.destinationTime}</Text>
            </Body>
          </CardItemNoBorders> */}
      </StyledCard>
    </StyledContainer>
  )
}

DestinationWalkCard.propTypes = {
  destinationName: PropTypes.string,
  destinationWalkingDistance: PropTypes.string,
  destinationWalkingDuration: PropTypes.string,
}

export default DestinationWalkCard
