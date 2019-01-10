import {Text} from 'native-base'
import {
  StyledCard,
  CardItemNoBorders,
  StyledContainer,
} from './StyledComponents'
import React from 'react'

const VanRideCard = () => {
  return (
    <StyledContainer>
      <StyledCard>
        <CardItemNoBorders>
          <Text>Hallo Welt</Text>
        </CardItemNoBorders>
      </StyledCard>
    </StyledContainer>
  )
}

VanRideCard.propTypes = {}

export default VanRideCard
