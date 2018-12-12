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
  Fab,
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

// For bottom button
const StyledFab = styled(Fab)`
  margin-bottom: 55px;
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

  // shows current position on the map
  showCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        // alert(position.coords.latitude+"\n"+position.coords.longitude);
        this.setState({
          marker: {
            current_latitude: position.coords.latitude,
            current_longitude: position.coords.longitude,
            error: null,
          },
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000}
    )
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

        {/* Floating Button to show current location */}
        <StyledFab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          position="bottomRight"
          onPress={() => this.showCurrentLocation()}>
          <Icon name="locate" />
        </StyledFab>

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
