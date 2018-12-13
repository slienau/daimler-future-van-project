import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Left, Right, Icon, Body} from 'native-base'

const OrderItem = props => {
  return (
    <ListItem button style={itemStyle} onPress={() => alert('TODO')}>
      <Left>
        <Text>
          {props.orderTime.format('L')}
          {'\n'}
          {props.orderTime.format('LT')}
        </Text>
      </Left>
      <Body>
        <Text>
          TODO: Start{'\n'}
          TODO: Destination
        </Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  )
}

const itemStyle = {
  // marginTop: 5,
  // marginBottom: 5,
}

OrderItem.propTypes = {
  orderTime: PropTypes.string,
}

export default OrderItem
