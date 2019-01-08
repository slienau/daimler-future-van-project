import BottomButton from './BottomButton'
import {MapState} from '../../../../ducks/map'
import React from 'react'
import PropTypes from 'prop-types'

const DestinationButton = props => {
  return (
    <BottomButton
      visible={props.mapState === MapState.INIT}
      iconRight
      onPress={props.onPress}
      text="destination"
      iconName="arrow-forward"
      bottom="3%"
    />
  )
}

DestinationButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default DestinationButton
