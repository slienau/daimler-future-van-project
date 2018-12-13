import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Left, Right, Icon, Body} from 'native-base'

const OrderItem = props => {
  const dateTimeString = props.orderTime.toLocaleString().split(', ')
  return (
    <ListItem button style={itemStyle} onPress={() => alert('TODO')}>
      <Left>
        <Text>
          {dateTimeString[0]}
          {'\n'}
          {dateTimeString[1].substr(0, 5)}
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
