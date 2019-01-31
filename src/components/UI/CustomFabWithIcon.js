import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const StyledFab = styled(Fab)`
  position: absolute;
  background-color: gray;
`

const CustomFabWithIcon = props => {
  return (
    <StyledFab onPress={props.onPress} position={props.position}>
      <Icon name={props.icon} />
    </StyledFab>
  )
}

CustomFabWithIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
}

export default CustomFabWithIcon
