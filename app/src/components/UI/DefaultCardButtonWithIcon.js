import React from 'react'
import {Card, Body, CardItem, Icon, Text} from 'native-base'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {DARK_COLOR, LIGHT_COLOR} from './colors'

const DefaultCardButtonWithIcon = props => {
  return (
    <Card transparent>
      <CardItem button onPress={props.onPress} style={styles.cardItem}>
        <Body style={styles.body}>
          <Icon name={props.icon} style={styles.icon} />
          <Text style={styles.text}>{props.title}</Text>
        </Body>
      </CardItem>
    </Card>
  )
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  text: {
    color: LIGHT_COLOR,
    fontSize: 21,
  },
  icon: {
    color: LIGHT_COLOR,
    fontSize: 65,
  },
  cardItem: {
    backgroundColor: DARK_COLOR,
    borderRadius: 30,
  },
})

DefaultCardButtonWithIcon.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func,
  title: PropTypes.string,
}

export default DefaultCardButtonWithIcon
