import React from 'react'
import _ from 'lodash'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import {Container} from 'native-base'
import Routes from '../Map/MapScreen/Routes'
import styled from 'styled-components/native'
import {connect} from 'react-redux'

const StyledMapView = styled(MapView)`
  flex: 1;
`

const inRideMapScreen = props => {
  const mapRegion = {
    latitude: _.get(props.activeOrder, 'route.startStation.location.latitude'),
    longitude: _.get(
      props.activeOrder,
      'route.startStation.location.longitude'
    ),
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }
  return (
    <Container>
      <StyledMapView
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={mapRegion}>
        <Routes hideStart />
      </StyledMapView>
    </Container>
  )
}

inRideMapScreen.propTypes = {
  activeOrder: PropTypes.object,
}

export default connect(state => ({
  activeOrder: state.orders.activeOrder,
}))(inRideMapScreen)
