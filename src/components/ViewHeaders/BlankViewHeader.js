import {Body, Header, Title} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const BlankViewHeader = props => {
  return (
    <Header>
      <Body>
        <Title>{props.title}</Title>
      </Body>
    </Header>
  )
}

BlankViewHeader.propTypes = {
  title: PropTypes.string,
}

export default BlankViewHeader
