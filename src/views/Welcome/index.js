import React, {Component} from 'react'
import {
  Body,
  Container,
  Header,
  Left,
  Item,
  Input,
  Title,
  Button,
  Text,
  Icon,
} from 'native-base'

import Map from '../Map'
import styled from 'styled-components/native'

// For bottom button
const StyledButton = styled(Button)`
  position: absolute;
  left: 30%;
  right: 30%;
  bottom: 4%;
`

export default class Welcome extends Component {
  // DrawNavigator settings
  static navigationOptions = {
    drawerIcon: () => <Icon name="map" />,
  }

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
        {/* Header with menu-slider (without header or transparent header?) */}
        <Header>
          <Left>
            <Button transparent>
              <Icon
                name="menu"
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Button>
          </Left>
          <Body>
            <Title>Navigation</Title>
          </Body>
        </Header>

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
        <StyledButton
          rounded
          iconRight
          light
          onPress={() => this.onSearchRoutes()}>
          <Text>destination </Text>
          <Icon name="arrow-forward" />
        </StyledButton>
      </Container>
    )
  }
}
