import React from 'react'
import {Container, Content, List} from 'native-base'
import {View, Dimensions, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'
import {getRegionForCoordinates} from '../../lib/utils'
import MapMarker from '../../components/MapMarker'
import OrderDetailListItem from './OrderDetailListItem'

const OrderDetail = props => {
  const order = props.navigation.getParam('order')
  const {width, height} = Dimensions.get('window')
  const mapHeight = 0.45 * height // 45% height

  const mapRegion = getRegionForCoordinates([
    order.virtualBusStopStart.location,
    order.virtualBusStopEnd.location,
  ])

  return (
    <Container>
      <Content scrollEnabled={false}>
        <View style={{width, height: mapHeight}}>
          <MapView
            region={mapRegion}
            style={styles.map}
            showsMyLocationButton={false}>
            <MapMarker
              title="Pickup point"
              description={order.virtualBusStopStart.name}
              location={order.virtualBusStopStart.location}
              image="person"
            />
            <MapMarker
              title="Dropoff point"
              description={order.virtualBusStopEnd.name}
              location={order.virtualBusStopEnd.location}
              image="destination"
            />
          </MapView>
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
            <OrderDetailListItem
              icon="bus"
              body="Distance"
              right={order.distance}
            />
            <OrderDetailListItem
              icon="trees"
              iconType="Foundation"
              body="CO2 savings"
              right={order.co2savings}
            />
            <OrderDetailListItem
              icon="star"
              body="Loyalty Points"
              right={order.bonuspoints}
            />
          </List>
        </View>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject,
  },
})

export default OrderDetail
