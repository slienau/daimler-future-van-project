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
import _ from 'lodash'
import styled from 'styled-components/native'

import api, {setToken} from '../../lib/api'

const StyledButton = styled(Button)`
  margin-top: 50px;
`

export default class Login extends React.Component {
  state = {
    username: '',
    password: '',
  }

  login = async () => {
    try {
      const {data} = await api.post(
        '/login',
        _.pick(this.state, ['username', 'password'])
      )
      setToken(data.token)
      this.props.navigation.navigate('MainView')
    } catch (err) {
      if (_.get(err, 'response.status') !== 400) throw err
      alert('Invalid username or password!')
    }
  }

  onChangePassword = password => {
    this.setState({password})
  }

  onChangeUsername = username => {
    this.setState({username})
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
              <Input
                value={this.state.username}
                onChangeText={this.onChangeUsername}
              />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input
                secureTextEntry
                value={this.state.password}
                onChangeText={this.onChangePassword}
              />
            </Item>
            <StyledButton full primary onPress={this.login}>
              <Text>Login</Text>
            </StyledButton>
          </Form>
        </Content>
      </Container>
    )
  }
}
