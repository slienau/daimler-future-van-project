import React from 'react'
import PropTypes from 'prop-types'
import DefaultIconButton from '../../../components/UI/DefaultIconButton'
import {StyleSheet} from 'react-native'

const CurrentLocationButton = props => {
  return (
    <DefaultIconButton
      icon="locate"
      onPress={props.onPress}
      style={styles.button}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 0,
  },
})

CurrentLocationButton.propTypes = {
  onPress: PropTypes.func,
}

export default CurrentLocationButton
