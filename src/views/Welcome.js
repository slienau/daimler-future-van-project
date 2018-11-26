import React, {Component} from 'react'
import {Text} from 'react-native'
import styled from 'styled-components/native'
import {SearchBar} from 'react-native-elements'
import {Container, Button, Footer, FooterTab, Icon} from 'native-base'

import Map from './Map'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`
const FooterText = styled.Text`
  color: orange;
`
const FooterButton = styled(Button)`
  background-color: 'rgb(46, 47, 49)';
`

export default class Welcome extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userLocationMarker: null,
      destinationMarker: null,
      routing: null,
    }
  }

  onSearchRoutes() {
    this.setState({
      marker: {
        userLocationMarker: 'nul',
        destinationMarker: 'keks',
        routing: 'schokokeks',
      },
    })
  }

  render() {
    console.log(this.state.marker)
    return (
      <StyledView>
        <Container>
          <SearchBar
            darkTheme
            // onChangeText={someMethod}
            // onClearText={someMethod}
            icon={{type: 'font-awesome', name: 'search'}}
            placeholder="From"
          />

          <SearchBar
            darkTheme
            // onChangeText={someMethod}
            // onClearText={someMethod}
            icon={{type: 'font-awesome', name: 'search'}}
            placeholder="To"
          />
          <Map {...this.state.marker} />

          <Button full iconRight warning onPress={() => this.onSearchRoutes()}>
            <Text>search route </Text>
            <Icon name="arrow-forward" />
          </Button>

          <Footer>
            <FooterTab>
              <FooterButton
                vertical
                onPress={() => this.props.navigation.navigate('Account')}>
                <Icon name="person" />
                <FooterText>Account</FooterText>
              </FooterButton>
              <FooterButton vertical active>
                <Icon active name="map" />
                <FooterText>Navigate</FooterText>
              </FooterButton>
              <FooterButton
                vertical
                onPress={() => this.props.navigation.navigate('Games')}>
                <Icon name="apps" />
                <FooterText>Games</FooterText>
              </FooterButton>
              <FooterButton
                vertical
                onPress={() => this.props.navigation.navigate('information')}>
                <Icon name="information" />
                <FooterText>Van Info</FooterText>
              </FooterButton>
            </FooterTab>
          </Footer>
        </Container>
      </StyledView>
    )
  }
}
