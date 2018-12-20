import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Right, Icon, Body} from 'native-base'
import {StyleSheet} from 'react-native'

const OrderListItem = props => {
  return (
    <ListItem button onPress={() => props.onItemPress()}>
      <Body>
        <Text>
          <Text style={styles.time}>
            {props.order.orderTime.format('L, LT')}
            {'\n'}
          </Text>
          <Text>
            From: {props.order.virtualBusStopStart.name} {'\n'}
            To: {props.order.virtualBusStopEnd.name}
          </Text>
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
