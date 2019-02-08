import React from 'react'
import {Container, Content, List} from 'native-base'
import {View, Dimensions, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'
import {getRegionForCoordinates} from '../../lib/utils'
import MapMarker from '../../components/MapMarker'
import DefaultListItem from '../../components/UI/DefaultListItem'
import {
  CO2SavingsIcon,
  DistanceIcon,
  EndVBSIcon,
  LoyaltyPointsIcon,
  StartVBSIcon,
} from '../../components/UI/defaultIcons'

const OrderHistoryDetailsScreen = props => {
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
            <DefaultListItem
              iconElement={<StartVBSIcon />}
              bodyText={order.vanStartVBS.name}
              rightText={order.vanEnterTime.format('LT')}
            />
            <DefaultListItem
              iconElement={<EndVBSIcon />}
              bodyText={order.vanEndVBS.name}
              rightText={order.vanExitTime.format('LT')}
            />
            <DefaultListItem
              iconElement={<DistanceIcon />}
              bodyText="Distance"
              rightText={order.distance + ' km'}
            />
            <DefaultListItem
              iconElement={<CO2SavingsIcon />}
              bodyText="CO2 savings"
              rightText={order.co2savings + ' kg'}
            />
            <DefaultListItem
              iconElement={<LoyaltyPointsIcon />}
              bodyText="Loyalty Points"
              rightText={order.loyaltyPoints}
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

export default OrderHistoryDetailsScreen
