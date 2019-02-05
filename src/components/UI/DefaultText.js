import React from 'react'
import {StyleSheet} from 'react-native'
import {Text} from 'native-base'
import {DARK_COLOR} from './colors'

const DefaultText = props => (
  <Text {...props} style={[styles.textHeading, props.style]}>
    {props.children}
  </Text>
)

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 16,
    color: DARK_COLOR,
  },
})

export default DefaultText
