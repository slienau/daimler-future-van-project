import React from 'react'

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

const Information = props => {
  return (
    <StyledView>
      <Text>Information View</Text>
      <Container>
        <Content />

        <Footer>
          <FooterTab>
            <Button
              vertical
              onPress={() => props.navigation.navigate('Account')}>
              <Icon name="person" />
              <Text>Account</Text>
            </Button>
            <Button
              vertical
              onPress={() => props.navigation.navigate('Welcome')}>
              <Icon name="map" />
              <Text>Navigate</Text>
            </Button>
            <Button vertical onPress={() => props.navigation.navigate('Games')}>
              <Icon name="apps" />
              <Text>Games</Text>
            </Button>
            <Button vertical active>
              <Icon active name="information" />
              <Text>Van Info</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </StyledView>
  )
}

export default Information
