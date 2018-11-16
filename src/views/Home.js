import React from 'react'
import {Text, Button} from 'react-native'
import styled from 'styled-components/native'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
const Home = props => {
  return (
    <StyledView>
      <Text>Home Screen</Text>
      <Button
        title="Go to Login"
        onPress={() => props.navigation.navigate('Login')}
      />
    </StyledView>
  )
}

export default Home
