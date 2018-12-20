import React from 'react'
import {Container, Content, List} from 'native-base'
import {View, Dimensions} from 'react-native'
import MapView from 'react-native-maps'
import {getRegionForCoordinates} from '../../../lib/utils'
import Marker from '../../Map/Marker'
import styled, {css} from 'styled-components/native'
import SubViewHeader from '../../../components/ViewHeaders/SubViewHeader'
import OrderDetailListItem from './OrderDetailListItem'

const OrderDetail = props => {
  const order = props.navigation.getParam('order')
  const {width, height} = Dimensions.get('window')
  const mapHeight = 0.6 * height

  const mapRegion = getRegionForCoordinates([
    order.virtualBusStopStart.location,
    order.virtualBusStopEnd.location,
  ])

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
            initialRegion={mapRegion}
            // style={mapStyle}
            showsMyLocationButton={false}>
            <Marker
              title="Van pickup location"
              description={order.virtualBusStopStart.name}
              location={order.virtualBusStopStart.location}
            />
            <Marker
              title="Van dropoff location"
              description={order.virtualBusStopEnd.name}
              location={order.virtualBusStopEnd.location}
            />
          </StyledMapView>
        </View>
        <View>
          <List>
            <OrderDetailListItem
              icon="pin"
              body={order.virtualBusStopStart.name}
              right={order.startTime.format('LT')}
            />
            <OrderDetailListItem
              icon="flag"
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
