import React from 'react'
import _ from 'lodash'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {Container, Content, Text, Button, Icon} from 'native-base'
import {changeMapState, MapState} from '../../ducks/map'
import VanCard from './VanCard'
import JourneyOverview from './JourneyOverview'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import api from '../../lib/api'

const MainRideScreen = props => {
  const handleClick = async () => {
    try {
      await api.put('/activeorder', {
        action: 'endride',
        userLocation: _.pick(props.userPosition, ['latitude', 'longitude']),
      })
      props.changeMapState(MapState.EXIT_VAN)
      props.navigation.dangerouslyGetParent().goBack()
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
        <Button block iconRight onPress={() => handleClick()}>
          <Text>Exit Van</Text>
          <Icon name="exit" />
        </Button>
      </Content>
    </Container>
  )
}

MainRideScreen.propTypes = {
  changeMapState: PropTypes.func,
  userPosition: PropTypes.object,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    currentUserLocation: state.map.currentUserLocation,
  }),
  dispatch => ({
    changeMapState: payload => dispatch(changeMapState(payload)),
  })
)(MainRideScreen)
