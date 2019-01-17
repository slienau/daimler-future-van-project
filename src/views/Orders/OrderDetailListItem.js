import React from 'react'
import {Text, ListItem, Left, Body, Right, Icon} from 'native-base'
import PropTypes from 'prop-types'

const OrderDetailListItem = props => {
  return (
    <ListItem icon>
      <Left>
        <Icon active name={props.icon} type={props.iconType} />
      </Left>
      <Body>
        <Text>{props.body}</Text>
      </Body>
      <Right>
        <Text>{props.right}</Text>
      </Right>
    </ListItem>
  )
}

OrderDetailListItem.propTypes = {
  body: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconType: PropTypes.string,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default OrderDetailListItem
