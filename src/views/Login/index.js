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
import {connect} from 'react-redux'
import styled from 'styled-components/native'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {login} from '../../ducks/account'

const StyledButton = styled(Button)`
  margin-top: 50px;
`

class Login extends React.Component {
  static propTypes = {
    login: PropTypes.func,
  }

  state = {
    username: '',
    password: '',
  }

  login = async () => {
    try {
      await this.props.login(this.state)
      this.props.navigation.navigate('MainView')
    } catch (err) {
      if (_.get(err, 'response.status') !== 400) throw err
      alert('Invalid username or password')
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

export default connect(
  state => ({}),
  dispatch => ({
    login: data => dispatch(login(data)),
  })
)(Login)
