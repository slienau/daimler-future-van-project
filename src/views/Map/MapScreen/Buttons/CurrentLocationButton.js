import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'

const StyledFab = styled(Fab)`
  margin-bottom: 52;
  z-index: 999;
`

const CurrentLocationButton = props => {
  return (
    <StyledFab direction="up" position="bottomRight" onPress={props.onPress}>
      <Icon name="locate" />
    </StyledFab>
  )
}

CurrentLocationButton.propTypes = {
  onPress: PropTypes.func,
}

export default CurrentLocationButton
