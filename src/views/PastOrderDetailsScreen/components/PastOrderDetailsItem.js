import React from 'react'
import {ListItem, Left, Body, Right, Icon} from 'native-base'
import PropTypes from 'prop-types'
import DefaultText from '../../../components/UI/DefaultText'

const PastOrderDetailsItem = props => {
  return (
    <ListItem icon>
      <Left>
        <Icon active name={props.icon} type={props.iconType} />
      </Left>
      <Body>
        <DefaultText>{props.body}</DefaultText>
      </Body>
      <Right>
        <DefaultText>{props.right}</DefaultText>
      </Right>
    </ListItem>
  )
}

PastOrderDetailsItem.propTypes = {
  body: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconType: PropTypes.string,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default PastOrderDetailsItem
