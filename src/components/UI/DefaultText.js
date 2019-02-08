import React from 'react'
import {StyleSheet} from 'react-native'
import {Text} from 'native-base'
import {DARK_COLOR, GREY_COLOR} from './colors'

const DefaultText = props => {
  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
      color: props.greyColor ? GREY_COLOR : DARK_COLOR,
    },
  })

  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  )
}

export default DefaultText
