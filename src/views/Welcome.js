import React from 'react'

import styled from 'styled-components/native'
import {SearchBar} from 'react-native-elements'
import {Container, Button, Footer, FooterTab, Icon, Text} from 'native-base'

import Map from './Map'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

const Welcome = props => {
  return (
    <StyledView>
      <Container>
        <SearchBar
          lightTheme
          // onChangeText={someMethod}
          // onClearText={someMethod}
          icon={{type: 'font-awesome', name: 'search'}}
          placeholder="From"
        />

        <SearchBar
          lightTheme
          // onChangeText={someMethod}
          // onClearText={someMethod}
          icon={{type: 'font-awesome', name: 'search'}}
          placeholder="To"
        />
        <Map />

        <Footer>
          <FooterTab>
            <Button
              vertical
              onPress={() => props.navigation.navigate('Account')}>
              <Icon name="person" />
              <Text>Account</Text>
            </Button>
            <Button vertical active>
              <Icon active name="map" />
              <Text>Navigate</Text>
            </Button>
            <Button vertical onPress={() => props.navigation.navigate('Games')}>
              <Icon name="apps" />
              <Text>Games</Text>
            </Button>
            <Button
              vertical
              onPress={() => props.navigation.navigate('information')}>
              <Icon name="information" />
              <Text>Van Info</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </StyledView>
  )
}

export default Welcome
