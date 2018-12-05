import React from 'react'
import {Button} from 'react-native'
import styled from 'styled-components/native'

import Logo from '../../components/Logo/Logo'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const ButtonView = styled.View`
  flex: 1;
  justify-content: flex-start;
  margin: 10px;
`

const Home = props => {
  return (
    <StyledView>
      <Logo />
      <ButtonView>
        <Button
          title="Go to Login"
          onPress={() => props.navigation.navigate('Login')}
        />
      </ButtonView>
      <ButtonView>
        <Button
          title="Go to Map"
          onPress={() => props.navigation.navigate('Map')}
        />
      </ButtonView>
      <ButtonView>
        <Button
          title="Go to Account Details"
          onPress={() => props.navigation.navigate('Account')}
        />
      </ButtonView>
    </StyledView>
  )
}

export default Home
