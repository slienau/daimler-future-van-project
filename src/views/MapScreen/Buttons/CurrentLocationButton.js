import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'
import {MapState} from '../../../ducks/map'

const StyledFab = styled(Fab)`
  position: absolute;
  top: ${props => props.top};
  z-index: 999;
`

const CurrentLocationButton = props => {
  if (![MapState.INIT, MapState.SEARCH_ROUTES].includes(props.mapState))
    return null
  let top = 22
  if (props.mapState === MapState.SEARCH_ROUTES) top = 290
  return (
    <StyledFab top={top + '%'} position="topRight" onPress={props.onPress}>
      <Icon name="locate" />
    </StyledFab>
  )
}

CurrentLocationButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default CurrentLocationButton
