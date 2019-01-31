import {Body, Button, Header, Icon, Left, Title} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const CustomScreenHeader = props => {
  let leftContent = null
  if (props.onPress) {
    leftContent = (
      <Left>
        <Button transparent>
          <Icon name={props.icon || 'arrow-back'} onPress={props.onPress} />
        </Button>
      </Left>
    )
  }
  return (
    <Header>
      {leftContent}
      <Body>
        <Title>{props.title}</Title>
      </Body>
    </Header>
  )
}

CustomScreenHeader.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func,
  title: PropTypes.string,
}

export default CustomScreenHeader
