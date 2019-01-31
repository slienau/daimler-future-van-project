import React from 'react'
import {StyleSheet, Text} from 'react-native'
import {DARK_COLOR} from './colors'

const HeadingText = props => (
  <Text {...props} style={[styles.textHeading, props.style]}>
    {props.children}
  </Text>
)

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: DARK_COLOR,
    marginTop: 10,
    marginBottom: 30,
  },
})

export default HeadingText
