import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Left, Right, Icon, Body} from 'native-base'

const OrderItem = props => {
  console.log('order item: ' + props.id, props.orderTime)
  return (
    <ListItem icon button onPress={() => alert('TODO')}>
      <Left>
        <Text>
          Date{'\n'}
          Time
        </Text>
      </Left>
      <Body>
        <Text>
          Start{'\n'}
          Destination
        </Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  )
}

OrderItem.propTypes = {
  id: PropTypes.string,
  orderTime: PropTypes.string,
}

export default OrderItem
