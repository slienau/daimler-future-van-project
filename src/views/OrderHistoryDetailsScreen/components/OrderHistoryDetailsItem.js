import React from 'react'
import {ListItem, Left, Body, Right, Icon} from 'native-base'
import PropTypes from 'prop-types'
import DefaultText from '../../../components/UI/DefaultText'

const OrderHistoryDetailsItem = props => {
  return (
    <ListItem icon>
      <Left>
        <Icon active name={props.icon} type={props.iconType} />
      </Left>
      <Body>
        <DefaultText>{props.body}</DefaultText>
      </Body>
      <Right>
        <DefaultText greyColor>{props.right}</DefaultText>
      </Right>
    </ListItem>
  )
}

OrderHistoryDetailsItem.propTypes = {
  body: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconType: PropTypes.string,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default OrderHistoryDetailsItem
