import React from 'react'
import _ from 'lodash'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import {Container} from 'native-base'
import Routes from '../MapScreen/Routes'
import MapMarkers from '../MapScreen/MapMarkers'
import styled from 'styled-components/native'
import {connect} from 'react-redux'

const StyledMapView = styled(MapView)`
  flex: 1;
`

const InRideMapScreen = props => {
  const mapRegion = {
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    ..._.get(props.activeOrderStatus, 'vanLocation'),
  }
  return (
    <Container>
      <StyledMapView
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={mapRegion}>
        <Routes />
        <MapMarkers />
      </StyledMapView>
    </Container>
  )
}

InRideMapScreen.propTypes = {
  activeOrderStatus: PropTypes.object,
}

export default connect(state => ({
  activeOrderStatus: state.orders.activeOrderStatus,
}))(InRideMapScreen)
