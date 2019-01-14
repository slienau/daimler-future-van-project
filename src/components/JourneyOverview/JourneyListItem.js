import React from 'react'
import PropTypes from 'prop-types'
import {Text, Body, Icon, ListItem, Left, Right} from 'native-base'

const JourneyListItem = props => {
  return (
    <ListItem icon>
      <Left>
        <Icon active name={props.iconName} style={{color: props.iconColor}} />
      </Left>
      <Body>
        <Text>{props.description}</Text>
      </Body>
      <Right>
        <Text>{props.info}</Text>
      </Right>
    </ListItem>
  )
}

JourneyListItem.propTypes = {
  description: PropTypes.string,
  iconColor: PropTypes,
  iconName: PropTypes.string,
  info: PropTypes.string,
}

export default JourneyListItem
