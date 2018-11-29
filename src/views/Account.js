import React from 'react'
import {AsyncStorage} from 'react-native'
import styled from 'styled-components/native'
import {
  Container,
  Content,
  Button,
  Footer,
  FooterTab,
  Icon,
  Text,
} from 'native-base'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

export default class Account extends React.Component {
  _signOutAsync = async () => {
    await AsyncStorage.clear()
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <StyledView>
        <Text>Account View</Text>
        <Container>
          <Content>
            <Button onPress={() => this._signOutAsync()}>
              <Text>Logout</Text>
            </Button>
          </Content>
          <Footer>
            <FooterTab>
              <Button vertical active>
                <Icon active name="person" />
                <Text>Account</Text>
              </Button>
              <Button
                vertical
                onPress={() => this.props.navigation.navigate('Welcome')}>
                <Icon name="map" />
                <Text>Navigate</Text>
              </Button>
              <Button
                vertical
                onPress={() => this.props.navigation.navigate('Games')}>
                <Icon name="apps" />
                <Text>Games</Text>
              </Button>
              <Button
                vertical
                onPress={() => this.props.navigation.navigate('Information')}>
                <Icon name="information" />
                <Text>Van Info</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyledView>
    )
  }
}
