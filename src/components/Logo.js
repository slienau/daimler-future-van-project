import React from 'react'
import styled from 'styled-components/native'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`

const IconText = styled.Text`
  font-size: 32;
`

const LogoText = styled.Text`
  margin-vertical: 15;
  font-size: 18;
`
const Logo = () => {
  return (
    <StyledView>
      <IconText>🚌</IconText>
      <LogoText>Welcome to my Daimler Shuttle</LogoText>
    </StyledView>
  )
}

export default Logo
