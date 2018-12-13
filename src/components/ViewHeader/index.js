import {Body, Button, Header, Icon, Left, Title} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const ViewHeader = props => {
  return (
    <Header>
      <Left>
        <Button transparent>
          <Icon name="menu" onPress={props.onMenuPress} />
        </Button>
      </Left>
      <Body>
        <Title>{props.title}</Title>
      </Body>
    </Header>
  )
}

ViewHeader.propTypes = {
  onMenuPress: PropTypes.func,
  title: PropTypes.string,
}

export default ViewHeader
