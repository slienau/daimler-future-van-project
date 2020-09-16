import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import {Button, Icon} from 'native-base'
import {DARK_COLOR, LIGHT_COLOR, LIGHT_GREY_COLOR} from './colors'

const DefaultIconButton = props => {
  const buttonSize = 60
  const styles = StyleSheet.create({
    button: {
      backgroundColor: !props.disabled ? DARK_COLOR : LIGHT_GREY_COLOR,
      borderRadius: buttonSize,
      width: buttonSize,
      height: buttonSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      color: LIGHT_COLOR,
      fontSize: 32,
      alignSelf: 'center',
    },
  })

  return (
    <Button
      rounded
      {...props}
      style={[styles.button, props.style]}
      onPress={!props.disabled ? props.onPress : null}>
      <Icon name={props.icon} style={styles.icon} />
    </Button>
  )
}

DefaultIconButton.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default DefaultIconButton
