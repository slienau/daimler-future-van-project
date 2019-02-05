import React from 'react'
import {ListItem, Text} from 'native-base'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import {DARK_COLOR} from './colors'

const styles = StyleSheet.create({
  headerText: {
    fontSize: 21,
    color: DARK_COLOR,
  },
})

const CustomListItemHeader = props => (
  <ListItem itemHeader first>
    <Text style={[styles.headerText, props.style]}>{props.title}</Text>
  </ListItem>
)

CustomListItemHeader.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
}

export default CustomListItemHeader
