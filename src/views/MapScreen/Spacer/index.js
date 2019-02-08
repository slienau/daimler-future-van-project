import React from 'react'
import {MapState} from '../../../ducks/map'
import styled from 'styled-components/native/dist/styled-components.native.esm'

const FlexView = styled.View`
  flex: ${props => props.flex};
  z-index: -1;
`

const Spacer = props => {
  switch (props.mapState) {
    case MapState.ROUTE_SEARCHED:
      return <FlexView flex={7} />
    default:
      return <FlexView flex={1} />
  }
}

export default Spacer
