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
      width: props.fullWidth ? '100%' : undefined,
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

  let iconLeft = null
  if (props.iconLeft)
    iconLeft = <Icon name={props.iconLeft} style={styles.icon} />

  let iconRight = null
  if (props.iconRight)
    iconRight = <Icon name={props.iconRight} style={styles.icon} />

  return (
    <Button
      rounded
      iconLeft={!!props.iconLeft}
      iconRight={!!props.iconRight}
      {...props}
      style={[styles.button, props.style]}
      onPress={!props.disabled ? props.onPress : null}>
      {iconLeft}
      {text}
      {iconRight}
    </Button>
  )
}

CustomButton.propTypes = {
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
}

export default CustomButton
