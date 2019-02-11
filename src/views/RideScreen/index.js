import React from 'react'
import _ from 'lodash'
import {Container, Content, Toast} from 'native-base'
import {endRide} from '../../ducks/orders'
import JourneyOverview from './components/JourneyOverview'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {ImageBackground, StyleSheet, View} from 'react-native'
import moment from 'moment'
import backgroundImage from './assets/background_ridescreen.jpg'
import CustomButton from '../../components/UI/CustomButton'
import {DARK_COLOR, GREY_COLOR} from '../../components/UI/colors'
import BigFlashingMessage from '../../components/UI/BigFlashingMessage'
import {defaultDangerToast} from '../../lib/toasts'
import CardButtons from './components/CardButtons'

const RideScreen = props => {
  const handleExitButtonClick = async () => {
    try {
      props.endRide()
      props.navigation.navigate('Map')
    } catch (error) {
      Toast.show(defaultDangerToast("Couldn't exit van. " + error.message))
    }
  }

  let remainingTimeMessage = 'Please wait a moment ...'
  if (props.activeOrderStatus)
    remainingTimeMessage =
      'Van will arrive ' +
      moment(_.get(props.activeOrderStatus, 'vanETAatDestinationVBS')).fromNow()

  let topContent = (
    <View style={[styles.topMessageContainer, styles.topContentContainer]}>
      <BigFlashingMessage message={remainingTimeMessage} />
    </View>
  )
  if (_.get(props.activeOrderStatus, 'userAllowedToExit'))
    topContent = (
      <View style={styles.topContentContainer}>
        <CustomButton
          fullWidth
          text="Exit Van"
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
          <View style={styles.cardButtonsContainer}>
            <CardButtons {...props} />
          </View>
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
  cardButtonsContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
})

RideScreen.propTypes = {
  activeOrderStatus: PropTypes.object,
  endRide: PropTypes.func,
}

export default connect(
  state => ({
    activeOrderStatus: state.orders.activeOrderStatus,
  }),
  dispatch => ({
    endRide: () => dispatch(endRide()),
  })
)(RideScreen)
