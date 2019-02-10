import {Text, Icon} from 'native-base'
import {
  CardItemNoBorders,
  IconCenterFlex,
  StyledCardFlex,
  RightAddress,
  LeftFlex,
  BodyFlex,
} from '../StyledComponents'
import React from 'react'
import PropTypes from 'prop-types'

const DestinationWalkCard = props => {
  return (
    <StyledCardFlex>
      <CardItemNoBorders>
        <LeftFlex>
          <Icon name="walk" />
          <BodyFlex>
            <Text>{props.destinationWalkingDuration}</Text>
            <Text note>{props.destinationWalkingDistance}</Text>
          </BodyFlex>
          <IconCenterFlex type="Entypo" name="arrow-long-right" />
        </LeftFlex>
        <RightAddress>
          <Text>{props.destinationName}</Text>
        </RightAddress>
      </CardItemNoBorders>
    </StyledCardFlex>
  )
}

DestinationWalkCard.propTypes = {
  destinationName: PropTypes.string,
  destinationWalkingDistance: PropTypes.string,
  destinationWalkingDuration: PropTypes.string,
}

export default DestinationWalkCard
