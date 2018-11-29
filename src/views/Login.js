import React from 'react'
import {
  Body,
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Title,
  Button,
  Text,
} from 'native-base'
import {AsyncStorage} from 'react-native'
import styled from 'styled-components/native'

const StyledButton = styled(Button)`
  margin-top: 50px;
`

export default class Login extends React.Component {
  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc')
    this.props.navigation.navigate('MainView')
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input secureTextEntry />
            </Item>
            <StyledButton full primary onPress={this._signInAsync}>
              <Text>Login</Text>
            </StyledButton>
          </Form>
        </Content>
      </Container>
    )
  }
}
