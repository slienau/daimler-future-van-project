import React from 'react'
import {Container, Content, List} from 'native-base'
import MapView, {Marker} from 'react-native-maps'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import SubViewHeader from '../../../components/ViewHeaders/SubViewHeader'
import OrderDetailListItem from './OrderDetailListItem'

const StyledView = styled.View`
  flex: 1;
  align-items: stretch;
`

const OrderDetail = props => {
  const order = props.navigation.getParam('order')
  return (
    <StyledView>
      <Container>
        <SubViewHeader
          title={order.orderTime.format('L')}
          onArrowBackPress={() => props.navigation.goBack()}
        />
        <Content>
          <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
              }}
            />
          </MapView>
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
        </Content>
      </Container>
    </StyledView>
  )
}

export default OrderDetail
