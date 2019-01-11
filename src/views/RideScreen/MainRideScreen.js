import React from 'react'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {Container, Content} from 'native-base'
import {StyleSheet} from 'react-native'

import VanCard from '../../components/VanCard'

const MainRideScreen = props => {
  return (
    <Container>
      <Content>
        <Grid>
          <Row>
            <Col style={styles.middle}>
              <VanCard
                header="Information"
                information=""
                icon="information-circle"
              />
            </Col>
            <Col>
              <VanCard header="Fun Facts" description={''} icon="star" />
            </Col>
          </Row>
          <Row>
            <Col>
              <VanCard header="Games" icon="game-controller-b" />
            </Col>
            <Col style={styles.middle}>
              <VanCard header="Sights" icon="globe" />
            </Col>
          </Row>
          <Row>
            <Col>
              <VanCard header="Map" icon="map" />
            </Col>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  middle: {
    width: '60%',
  },
})

export default MainRideScreen
