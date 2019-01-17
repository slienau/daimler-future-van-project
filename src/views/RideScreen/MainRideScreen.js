import React from 'react'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {Container, Content, ListItem, Text, Button, Icon} from 'native-base'
import {StyleSheet} from 'react-native'

import VanCard from './VanCard'
import JourneyOverview from './JourneyOverview'

const MainRideScreen = props => {
  return (
    <Container>
      <Content>
        <Grid>
          <Row>
            <Col>
              <ListItem itemHeader first>
                <Text style={styles.headerSize}>Journey overview</Text>
              </ListItem>
              <JourneyOverview />
            </Col>
          </Row>
          <Row>
            <Col>
              <VanCard
                header="Games"
                icon="game-controller-b"
                onPress={() => props.navigation.navigate('GamesScreen')}
              />
            </Col>
            <Col>
              <VanCard
                header="Sights"
                icon="globe"
                onPress={() => props.navigation.navigate('SightsScreen')}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <VanCard
                header="Fun Facts"
                description={''}
                icon="star"
                onPress={() => props.navigation.navigate('FunfactsScreen')}
              />
            </Col>
            <Col>
              <VanCard
                header="Map"
                icon="map"
                onPress={() => props.navigation.navigate('inRideMapScreen')}
              />
            </Col>
          </Row>
        </Grid>
        <Button disabled block iconRight>
          <Text>Exit Van</Text>
          <Icon name="exit" />
        </Button>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  headerSize: {
    fontSize: 21,
  },
})

export default MainRideScreen
