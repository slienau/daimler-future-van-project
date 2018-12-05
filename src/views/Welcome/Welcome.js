import React, {Component} from 'react'
import {
  Container,
  Button,
  Footer,
  FooterTab,
  Header,
  Icon,
  Item,
  Input,
  Text,
} from 'native-base'

import Map from '../Map/Map'

export default class Welcome extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userLocationMarker: null,
      destinationMarker: null,
      routing: null,
    }
  }

  // sets location for start and destination
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
      <Container>
        {/* start location input */}
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="From" />
          </Item>
        </Header>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="To" />
          </Item>
        </Header>
        {/* Map */}
        <Map {...this.state.marker} />
        {/* button for searching route */}
        <Button full iconRight light onPress={() => this.onSearchRoutes()}>
          <Text>search route </Text>
          <Icon name="arrow-forward" />
        </Button>
        <Footer>
          <FooterTab>
            <Button
              vertical
              onPress={() => this.props.navigation.navigate('Account')}>
              <Icon name="person" />
              <Text>Account</Text>
            </Button>
            <Button vertical active>
              <Icon active name="map" />
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
    )
  }
}
