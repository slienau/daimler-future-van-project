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
import {ImageBackground, StyleSheet, View} from 'react-native'
import moment from 'moment'
import backgroundImage from './assets/background_ridescreen.jpg'
import CustomButton from '../../components/UI/CustomButton'
import {DARK_COLOR, GREY_COLOR} from '../../components/UI/colors'
import RemainingTimeMessage from './components/RemainingTimeMessage'

const RideScreen = props => {
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

  const remainingTimeMessage = moment(
    _.get(props.activeOrderStatus, 'vanETAatDestinationVBS')
  ).fromNow()

  let topContent = (
    <View style={[styles.topMessageContainer, styles.topContentContainer]}>
      <RemainingTimeMessage message={remainingTimeMessage} />
    </View>
  )
  if (_.get(props.activeOrderStatus, 'userAllowedToExit'))
    topContent = (
      <View style={styles.topContentContainer}>
        <CustomButton
          fullWidth
          text="Exit Van"
          // disabled={!_.get(props.activeOrderStatus, 'userAllowedToExit')}
          iconRight="exit"
          onPress={() => handleExitButtonClick()}
        />
      </View>
    )

  return (
    <Container>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImageContainer}
        imageStyle={styles.backgroundImage}>
        <Content contentContainerStyle={styles.contentContainer}>
          {topContent}

          <View style={styles.journeyOverviewContainer}>
            <JourneyOverview />
          </View>
          <Grid>
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
        </Content>
      </ImageBackground>
    </Container>
  )
}

const TRANSPARENT_WHITE_BACKGROUND = 'rgba(255, 255, 255, 0.7)'
const TRANSPARENT_DARK_BACKGROUND = 'rgba(0, 0, 0, 0.75)'

const styles = StyleSheet.create({
  backgroundImageContainer: {
    width: '100%',
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.6,
  },
  topContentContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  topMessageContainer: {
    backgroundColor: TRANSPARENT_DARK_BACKGROUND,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  journeyOverviewContainer: {
    backgroundColor: TRANSPARENT_WHITE_BACKGROUND,
    color: DARK_COLOR,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: GREY_COLOR,
  },
  contentContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
})

RideScreen.propTypes = {
  activeOrderStatus: PropTypes.object,
  changeMapState: PropTypes.func,
  currentUserLocation: PropTypes.object,
}

export default connect(
  state => ({
    activeOrderStatus: state.orders.activeOrderStatus,
    currentUserLocation: state.map.currentUserLocation,
  }),
  dispatch => ({
    changeMapState: payload => dispatch(changeMapState(payload)),
  })
)(RideScreen)
