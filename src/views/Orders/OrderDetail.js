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
    order.vanStartVBS.location,
    order.vanEndVBS.location,
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
              description={order.vanStartVBS.name}
              location={order.vanStartVBS.location}
              image="person"
            />
            <MapMarker
              title="Dropoff point"
              description={order.vanEndVBS.name}
              location={order.vanEndVBS.location}
              image="destination"
            />
          </MapView>
        </View>
        <View>
          <List>
            <OrderDetailListItem
              icon="pin"
              body={order.vanStartVBS.name}
              right={order.vanEnterTime.format('LT')}
            />
            <OrderDetailListItem
              icon="flag"
              body={order.vanEndVBS.name}
              right={order.vanExitTime.format('LT')}
            />
            <OrderDetailListItem
              icon="bus"
              body="Distance"
              right={order.distance + ' km'}
            />
            <OrderDetailListItem
              icon="trees"
              iconType="Foundation"
              body="CO2 savings"
              right={order.co2savings + ' kg'}
            />
            <OrderDetailListItem
              icon="star"
              body="Loyalty Points"
              right={order.loyaltyPoints}
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
