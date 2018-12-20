import React from 'react'
import {Container, Content, List} from 'native-base'
import {View, Dimensions} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
// import Marker from '../../Map/Marker'
import styled, {css} from 'styled-components/native'
import SubViewHeader from '../../../components/ViewHeaders/SubViewHeader'
import OrderDetailListItem from './OrderDetailListItem'

const OrderDetail = props => {
  const order = props.navigation.getParam('order')
  const {width, height} = Dimensions.get('window')
  const ratio = width / height
  const mapHeight = 0.6 * height

  const coordinates = {
    latitude: 52.509663,
    longitude: 13.376481,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0922 * ratio,
  }

  const mapStyle = css`
    position: absolute;
    margin-top: 1.5;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  `

  const StyledMapView = styled(MapView)`
    position: absolute;
    margin-top: 1.5;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  `

  return (
    <Container>
      <SubViewHeader
        title={order.orderTime.format('L')}
        onArrowBackPress={() => props.navigation.goBack()}
      />
      <Content scrollEnabled={false}>
        <View style={{width, height: mapHeight}}>
          <StyledMapView
            region={coordinates}
            // style={mapStyle}
            showsMyLocationButton={false}>
            <Marker
              title="Start"
              description="Van start location"
              coordinate={order.virtualBusStopStart.location}
            />
            <Marker
              title="End"
              description="Van end location"
              coordinate={order.virtualBusStopEnd.location}
            />
          </StyledMapView>
        </View>
        <View>
          <List>
            <OrderDetailListItem
              icon="locate"
              body={order.virtualBusStopStart.name}
              right={order.startTime.format('LT')}
            />
            <OrderDetailListItem
              icon="locate"
              body={order.virtualBusStopEnd.name}
              right={order.endTime.format('LT')}
            />
          </List>
        </View>
      </Content>
    </Container>
  )
}

export default OrderDetail
