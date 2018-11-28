import React from 'react'
import {Button, AsyncStorage} from 'react-native'
import styled from 'styled-components/native'

import Logo from '../components/Logo'

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

export default class Login extends React.Component {
  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc')
    this.props.navigation.navigate('MainView')
  }

  render() {
    return (
      <StyledView>
        <Logo />
        <ButtonView>
          <Button title="Login" onPress={() => this._signInAsync()} />
        </ButtonView>
      </StyledView>
    )
  }
}
