import React from 'react'
import {Col, Row, Grid} from 'react-native-easy-grid'
import VanCard from '../../components/VanCard'

const MainRideScreen = props => {
  return (
    <Grid>
      <Row size={1}>
        <Col>
          <VanCard
            header="Information"
            description={
              'descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription'
            }
            icon="information-circle"
          />
        </Col>
      </Row>
      <Row size={1}>
        <Col>
          <VanCard
            header="Fun Facts"
            description={'descriptiondescriptiondescription'}
            icon="star"
          />
        </Col>
        <Col>
          <VanCard
            header="Games"
            description={'descriptiondescriptiondescription'}
            icon="game-controller-b"
          />
        </Col>
        <Col>
          <VanCard
            header="Sights"
            description={'descriptiondescriptiondescription'}
            icon="globe"
          />
        </Col>
      </Row>
      <Row size={2}>
        <Col>
          <VanCard
            header="Map"
            description={
              'MapView\nMapView\nMapView\nMapView\nMapView\nMapView\nMapView\nMapView\nMapView\n'
            }
            icon="map"
          />
        </Col>
      </Row>
    </Grid>
  )
}

export default MainRideScreen
