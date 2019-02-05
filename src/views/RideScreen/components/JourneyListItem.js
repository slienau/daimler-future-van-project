import React from 'react'
import PropTypes from 'prop-types'
import {Body, Icon, ListItem, Left, Right} from 'native-base'
import DefaultText from '../../../components/UI/DefaultText'

const JourneyListItem = props => {
  return (
    <ListItem icon>
      <Left>
        <Icon active name={props.iconName} style={{color: props.iconColor}} />
      </Left>
      <Body>
        <DefaultText>{props.description}</DefaultText>
      </Body>
      <Right>
        <DefaultText>{props.info}</DefaultText>
      </Right>
    </ListItem>
  )
}

JourneyListItem.propTypes = {
  description: PropTypes.string,
  iconColor: PropTypes.string,
  iconName: PropTypes.string,
  info: PropTypes.string,
}

export default JourneyListItem
