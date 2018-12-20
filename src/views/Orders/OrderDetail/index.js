import React from 'react'
import {Container, Content, List, Footer} from 'native-base'
import {View, Dimensions, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import SubViewHeader from '../../../components/ViewHeaders/SubViewHeader'
import OrderDetailListItem from './OrderDetailListItem'

// const StyledMapView = styled(MapView)`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   margin-bottom: 0;
// `

const StyledMapView = styled(MapView)`
  flex: 1;
`

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject,
  },
})

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

  return (
    <Container>
      <SubViewHeader
        title={order.orderTime.format('L')}
        onArrowBackPress={() => props.navigation.goBack()}
      />
      <Content scrollEnabled={false}>
        <View style={{width, height: mapHeight}}>
          <MapView
            region={coordinates}
            style={styles.map}
            showsMyLocationButton={false}
          />
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
