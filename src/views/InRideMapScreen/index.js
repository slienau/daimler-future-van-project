import React from 'react'
import _ from 'lodash'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import {Container, Toast} from 'native-base'
import Routes from '../MapScreen/Routes'
import MapMarkers from '../MapScreen/MapMarkers'
import styled from 'styled-components/native'
import {connect} from 'react-redux'
import {StyleSheet, View} from 'react-native'
import BigFlashingMessage from '../../components/UI/BigFlashingMessage'
import moment from 'moment'
import DefaultButton from '../../components/UI/DefaultButton'
import {defaultDangerToast} from '../../lib/toasts'
import {endRide} from '../../ducks/orders'

const FullScreenMapView = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const InRideMapScreen = props => {
  const mapRegion = {
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    ..._.get(props.activeOrderStatus, 'vanLocation'),
  }

  const handleExitButtonClick = async () => {
    try {
      props.endRide()
      props.navigation.navigate('Map')
    } catch (error) {
      Toast.show(defaultDangerToast("Couldn't exit van. " + error.message))
    }
  }

  let topMessage = 'Please wait a moment ...'
  if (props.activeOrderStatus) {
    topMessage =
      'Van will arrive ' +
      moment(_.get(props.routeInfo, 'vanArrivalTime')).fromNow()
  }
  if (_.get(props.activeOrderStatus, 'userAllowedToExit')) {
    topMessage = 'Van has arrived. Please exit.'
  }

  return (
    <Container>
      <FullScreenMapView
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={mapRegion}>
        <Routes />
        <MapMarkers />
      </FullScreenMapView>
      <View style={styles.topContentContainer}>
        <BigFlashingMessage message={topMessage} />
        {_.get(props.activeOrderStatus, 'userAllowedToExit') && (
          <DefaultButton
            style={styles.button}
            fullWidth
            text="Exit Van"
            iconRight="exit"
            onPress={() => handleExitButtonClick()}
          />
        )}
      </View>
    </Container>
  )
}

const TRANSPARENT_DARK_BACKGROUND = 'rgba(0, 0, 0, 0.75)'

const styles = StyleSheet.create({
  topContentContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: TRANSPARENT_DARK_BACKGROUND,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    marginTop: 10,
  },
})

InRideMapScreen.propTypes = {
  activeOrderStatus: PropTypes.object,
  endRide: PropTypes.func,
  routeInfo: PropTypes.object,
}

export default connect(
  state => ({
    activeOrderStatus: state.orders.activeOrderStatus,
    routeInfo: state.map.routeInfo,
  }),
  dispatch => ({
    endRide: () => dispatch(endRide()),
  })
)(InRideMapScreen)
