import React from 'react'
import {StyleSheet, View} from 'react-native'
import CustomCardButtonWithIcon from '../../../components/UI/CustomCardButtonWithIcon'

const CardButtons = props => {
  return (
    <>
      <View style={styles.cardButtonsRow}>
        <View style={styles.accountButton}>
          <CustomCardButtonWithIcon
            title="Account"
            icon="md-person"
            onPress={() => props.navigation.push('Account')}
          />
        </View>
        <View style={styles.funfactsButton}>
          <CustomCardButtonWithIcon
            title="Fun Facts"
            icon="star"
            onPress={() => props.navigation.push('Funfacts')}
          />
        </View>
      </View>
      <View>
        <CustomCardButtonWithIcon
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
