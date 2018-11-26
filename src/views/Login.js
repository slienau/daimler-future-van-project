import React from 'react'
import {Text, Button} from 'react-native'
import styled from 'styled-components/native'
import PropTypes from 'prop-types'

const StyledView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`
const Login = ({onLogin}) => {
  return (
    <StyledView>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={() => onLogin(true)} />
    </StyledView>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func,
}

export default Login
