import React from 'react'
import {ListItem, Text} from 'native-base'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import {DARK_COLOR} from './colors'

const styles = StyleSheet.create({
  headerText: {
    fontSize: 21,
    color: DARK_COLOR,
    fontWeight: 'bold',
  },
  listItem: {
    paddingTop: 10,
    paddingBottom: 10,
  },
})

const DefaultListItemHeader = props => (
  <ListItem itemHeader first style={styles.listItem}>
    <Text style={[styles.headerText, props.style]}>{props.title}</Text>
  </ListItem>
)

DefaultListItemHeader.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
}

export default DefaultListItemHeader
