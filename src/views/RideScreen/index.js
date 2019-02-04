import React from 'react'
import _ from 'lodash'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {Container, Content} from 'native-base'
import {changeMapState, MapState} from '../../ducks/map'
import VanCard from './components/VanCard'
import JourneyOverview from './components/JourneyOverview'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import api from '../../lib/api'
import {ImageBackground, StyleSheet} from 'react-native'
import backgroundImage from './assets/background_ridescreen.jpg'
import CustomButton from '../../components/UI/CustomButton'

const MainRideScreen = props => {
  const handleExitButtonClick = async () => {
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
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImageContainer}
        imageStyle={styles.backgroundImage}>
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
          <CustomButton
            fullWidth
            style={styles.exitButton}
            text="Exit Van"
            disabled={!_.get(props.activeOrderStatus, 'userAllowedToExit')}
            iconRight="exit"
            onPress={() => handleExitButtonClick()}
          />
        </Content>
      </ImageBackground>
    </Container>
  )
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    width: '100%',
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.6,
  },
  exitButton: {
    marginTop: 20,
  },
})

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
