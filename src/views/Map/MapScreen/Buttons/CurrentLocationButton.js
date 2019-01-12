import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'
import {MapState} from '../../../../ducks/map'

const StyledFab = styled(Fab)`
  position: absolute;
  top: ${props => props.top};
  z-index: 999;
`

const CurrentLocationButton = props => {
  let top = 22
  switch (props.mapState) {
    case MapState.SEARCH_ROUTES:
      top = 200
      break
    case MapState.ROUTE_SEARCHED:
      top = 300
      break
  }
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
