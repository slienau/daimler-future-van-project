import React from 'react'
import _ from 'lodash'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {Container, Content, Text, Button, Icon} from 'native-base'
import {changeMapState, MapState} from '../../ducks/map'
import VanCard from './components/VanCard'
import JourneyOverview from './components/JourneyOverview'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import api from '../../lib/api'

const MainRideScreen = props => {
  const handleClick = async () => {
    try {
      await api.put('/activeorder', {
        action: 'endride',
        userLocation: _.pick(props.currentUserLocation, [
          'latitude',
          'longitude',
        ]),
      })
      props.changeMapState(MapState.EXIT_VAN)
      props.navigation.goBack()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container>
      <Content>
        <JourneyOverview />
        <Grid>
          <Row>
            <Col>
              <VanCard
                header="Games"
                icon="game-controller-b"
                onPress={() => props.navigation.push('Games')}
              />
            </Col>
            <Col>
              <VanCard
                header="Sights"
                icon="globe"
                onPress={() => props.navigation.push('Sights')}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <VanCard
                header="Fun Facts"
                description={''}
                icon="star"
                onPress={() => props.navigation.push('Funfacts')}
              />
            </Col>
            <Col>
              <VanCard
                header="Map"
                icon="map"
                onPress={() => props.navigation.push('InRideMap')}
              />
            </Col>
          </Row>
        </Grid>
        <Button
          block
          disabled={!_.get(props.activeOrderStatus, 'userAllowedToExit')}
          iconRight
          onPress={() => handleClick()}>
          <Text>Exit Van</Text>
          <Icon name="exit" />
        </Button>
      </Content>
    </Container>
  )
}

MainRideScreen.propTypes = {
  activeOrderStatus: PropTypes.object,
  changeMapState: PropTypes.func,
  currentUserLocation: PropTypes.object,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    activeOrderStatus: state.orders.activeOrderStatus,
    currentUserLocation: state.map.currentUserLocation,
  }),
  dispatch => ({
    changeMapState: payload => dispatch(changeMapState(payload)),
  })
)(MainRideScreen)
