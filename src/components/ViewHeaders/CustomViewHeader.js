import {Body, Button, Header, Icon, Left, Title} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const CustomViewHeader = props => {
  return (
    <Header>
      <Left>
        <Button transparent>
          <Icon name={props.icon} onPress={props.onPress} />
        </Button>
      </Left>
      <Body>
        <Title>{props.title}</Title>
      </Body>
    </Header>
  )
}

CustomViewHeader.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func,
  title: PropTypes.string,
}

export default CustomViewHeader
