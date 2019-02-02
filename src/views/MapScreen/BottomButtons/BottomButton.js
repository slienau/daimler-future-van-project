import React from 'react'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import CustomButton from '../../../components/UI/CustomButton'

const BottomButton = props => {
  const styles = StyleSheet.create({
    button: {
      position: 'absolute', // TODO: no absolute positioning
      left: props.left || '30%',
      bottom: props.bottom || '0%',
      right: props.right || '30%',
      display: 'flex',
      justifyContent: 'center',
    },
  })
  return (
    <CustomButton
      onPress={props.onPress}
      style={styles.button}
      text={props.text}
      iconRight={props.iconName}
    />
  )
}

BottomButton.propTypes = {
  bottom: PropTypes.string,
  iconName: PropTypes.string,
  left: PropTypes.string,
  onPress: PropTypes.func,
  right: PropTypes.string,
  text: PropTypes.string,
}

export default BottomButton
