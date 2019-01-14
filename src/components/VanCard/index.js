import React from 'react'
import PropTypes from 'prop-types'
import {View, Dimensions, StyleSheet} from 'react-native'
import MapView from 'react-native-maps'
import {getRegionForCoordinates} from '../../lib/utils'
import MapMarker from '../../components/MapMarker'
import {Text, Card, CardItem, Body, Icon} from 'native-base'

const VanCard = props => {
  let bodyCardItem = null
  if (props.information !== '') {
    bodyCardItem = (
      <CardItem
        button
        onPress={() => alert('TODO: connect with navigation to subviews')}>
        <Body style={styles.cardItemHeader}>
          <Icon name={props.icon} style={styles.iconSize} />
          <Text style={styles.cardItemText}>{props.header}</Text>
        </Body>
      </CardItem>
    )
  } else {
    bodyCardItem = (
      <CardItem>
        <Body style={styles.cardItemHeader}>
          <Text style={styles.cardItemText}>{props.header}</Text>
          <Text />
          <Text>Time od Arrival: 10:23</Text>
          <Text>Time od Arrival: 10:23</Text>
          <Text>Time od Arrival: 10:23</Text>
          <Text>Time od Arrival: 10:23</Text>
        </Body>
      </CardItem>
    )
  }
  const {width, height} = Dimensions.get('window')
  const mapHeight = 0.3 * height // 60% height

  const mapRegion = getRegionForCoordinates([
    {longitude: 13.33079338, latitude: 52.49158698},
    {longitude: 13.33611488, latitude: 52.51329582},
  ])
  if (props.header === 'Map') {
    bodyCardItem = (
      <CardItem
        button
        onPress={() => alert('TODO: connect with navigation to subviews')}>
        <Body style={styles.cardItemHeader}>
          <View style={{width, height: mapHeight}}>
            <MapView
              region={mapRegion}
              style={styles.map}
              showsMyLocationButton={false}>
              <MapMarker
                title="Pickup point"
                description={'Pickup point'}
                location={{longitude: 13.33079338, latitude: 52.49158698}}
                image="person"
              />
              <MapMarker
                title="Dropoff point"
                description={'Dropoff point'}
                image="destination"
                location={{longitude: 13.33611488, latitude: 52.51329582}}
              />
            </MapView>
          </View>
        </Body>
      </CardItem>
    )
  }

  return <Card>{bodyCardItem}</Card>
}

VanCard.propTypes = {
  header: PropTypes.string,
  icon: PropTypes.string,
  information: PropTypes.string,
  // image: PropTypes.string,
}

const styles = StyleSheet.create({
  cardItemHeader: {
    alignItems: 'center',
  },
  cardItemText: {
    fontSize: 21,
  },
  iconSize: {
    fontSize: 100,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default VanCard
