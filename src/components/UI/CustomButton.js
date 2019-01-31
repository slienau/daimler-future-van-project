import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import {Button, Icon, Text} from 'native-base'
import {DARK_COLOR, GREY_COLOR, LIGHT_COLOR} from './colors'

const CustomButton = props => {
  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      backgroundColor: !props.disabled ? DARK_COLOR : GREY_COLOR,
    },
    icon: {
      color: LIGHT_COLOR,
      fontSize: 34,
    },
    text: {
      color: LIGHT_COLOR,
      fontWeight: 'bold',
      fontSize: 16,
    },
  })

  let text = null
  if (props.text) text = <Text style={styles.text}>{props.text}</Text>

  let leftIcon = null
  if (props.leftIcon)
    leftIcon = <Icon name={props.leftIcon} style={styles.icon} />

  let rightIcon = null
  if (props.rightIcon)
    rightIcon = <Icon name={props.rightIcon} style={styles.icon} />

  return (
    <Button
      rounded
      iconLeft={!!props.leftIcon}
      iconRight={!!props.rightIcon}
      {...props}
      style={[styles.button, props.style]}
      onPress={!props.disabled ? props.onPress : null}>
      {leftIcon}
      {text}
      {rightIcon}
    </Button>
  )
}

CustomButton.propTypes = {
  disabled: PropTypes.bool,
  leftIcon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  rightIcon: PropTypes.string,
  text: PropTypes.string,
}

export default CustomButton
