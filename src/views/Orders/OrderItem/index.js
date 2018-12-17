import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Right, Icon, Body} from 'native-base'
import {StyleSheet} from 'react-native'

const OrderItem = props => {
  return (
    <ListItem button style={styles.itemStyle} onPress={() => alert('TODO')}>
      <Body>
        <Text>
          <Text style={styles.time}>
            {props.orderTime.format('L, LT')}
            {'\n'}
          </Text>
          <Text>
            From: Start{'\n'}
            To: Destination
          </Text>
        </Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  )
}

OrderItem.propTypes = {
  orderTime: PropTypes.string,
}

const styles = StyleSheet.create({
  time: {
    fontWeight: 'bold',
  },
  itemStyle: {},
})

export default OrderItem
