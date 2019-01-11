import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'
import {MapState} from '../../../../ducks/map'

const StyledMenu = styled(Fab)`
  position: absolute;
  top: 22%;
  background-color: gray;
`

const MenuButton = props => {
  if (props.mapState !== MapState.INIT) return null
  return (
    <StyledMenu onPress={props.onPress} position="topLeft">
      <Icon name="menu" />
    </StyledMenu>
  )
}

MenuButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default MenuButton
