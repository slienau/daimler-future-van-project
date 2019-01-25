import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Right, Icon, Body} from 'native-base'
import {StyleSheet} from 'react-native'

const OrderListItem = props => {
  let bodyText = 'Order has been canceled'
  if (!props.order.canceled) {
    bodyText = (
      <Text>
        From: {props.order.vanStartVBS.name} {'\n'}
        To: {props.order.vanEndVBS.name}
      </Text>
    )
  }
  return (
    <ListItem
      button
      onPress={() => {
        if (!props.order.canceled) props.onItemPress()
      }}>
      <Body>
        <Text>
          <Text style={styles.time}>
            {props.order.orderTime.format('L, LT')}
            {'\n'}
          </Text>
          {bodyText}
        </Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  )
}

OrderListItem.propTypes = {
  onItemPress: PropTypes.func,
  order: PropTypes.object,
}

const styles = StyleSheet.create({
  time: {
    fontWeight: 'bold',
  },
})

export default OrderListItem
