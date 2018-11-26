import React, {Component} from 'react'
import {StyleSheet, Text} from 'react-native'
import styled from 'styled-components/native'
import {SearchBar} from 'react-native-elements'
import {Container, Button, Footer, FooterTab, Icon} from 'native-base'

import Map from './Map'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

const orange = 'orange'
const bgColor = 'rgb(46, 47, 49)'

const styles = StyleSheet.create({
  text: {
    color: orange,
  },
  button: {
    backgroundColor: bgColor,
  },
})

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
              <Button
                vertical
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Account')}>
                <Icon name="person" />
                <Text style={styles.text}>Account</Text>
              </Button>
              <Button vertical style={styles.button} active>
                <Icon active name="map" />
                <Text style={styles.text}>Navigate</Text>
              </Button>
              <Button
                vertical
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Games')}>
                <Icon name="apps" />
                <Text style={styles.text}>Games</Text>
              </Button>
              <Button
                vertical
                style={styles.button}
                onPress={() => this.props.navigation.navigate('information')}>
                <Icon name="information" />
                <Text style={styles.text}>Van Info</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyledView>
    )
  }
}
