import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const StyledMenu = styled(Fab)`
  position: absolute;
  top: 22%;
  background-color: gray;
`

const MenuButton = props => {
  return (
    <StyledMenu
      iconLeft
      onPress={props.onPress}
      iconName="arrow-back"
      left="3%"
      right="85%"
      bottom="15%"
      direction="up"
      position="topLeft">
      <Icon name="menu" />
    </StyledMenu>
  )
}

MenuButton.propTypes = {
  onPress: PropTypes.func,
}

export default MenuButton
