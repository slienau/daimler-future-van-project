import React from 'react'
import {StyleSheet, View} from 'react-native'
import DefaultCardButtonWithIcon from '../../../components/UI/DefaultCardButtonWithIcon'

const CardButtons = props => {
  return (
    <>
      <View style={styles.cardButtonsRow}>
        <View style={styles.accountButton}>
          <DefaultCardButtonWithIcon
            title="Account"
            icon="md-person"
            onPress={() => props.navigation.push('Account')}
          />
        </View>
        <View style={styles.funfactsButton}>
          <DefaultCardButtonWithIcon
            title="Fun Facts"
            icon="star"
            onPress={() => props.navigation.push('Funfacts')}
          />
        </View>
      </View>
      <View>
        <DefaultCardButtonWithIcon
          title="Map"
          icon="map"
          onPress={() => props.navigation.push('InRideMap')}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  cardButtonsRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  accountButton: {
    width: '50%',
    paddingRight: '1%',
  },
  funfactsButton: {
    width: '50%',
    paddingLeft: '1%',
  },
})

export default CardButtons
