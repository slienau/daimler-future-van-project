import {Text} from 'native-base'
import {
  StyledCard,
  CardItemNoBorders,
  StyledContainer,
} from './StyledComponents'
import React from 'react'

const DestinationWalkCard = () => {
  return (
    <StyledContainer>
      <StyledCard>
        <CardItemNoBorders>
          <Text>Hallo Welt, erneut</Text>
        </CardItemNoBorders>
      </StyledCard>
    </StyledContainer>
  )
}

DestinationWalkCard.propTypes = {}

export default DestinationWalkCard
