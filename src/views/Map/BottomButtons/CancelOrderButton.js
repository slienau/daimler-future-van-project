import BottomButton from './BottomButton'
import {MapState} from '../../../ducks/map'
import React from 'react'
import PropTypes from 'prop-types'

const CancelOrderButton = props => {
  return (
    <BottomButton
      visible={props.mapState === MapState.ROUTE_SEARCHED}
      iconLeft
      onPress={props.onPress}
      text="Cancel"
      iconName="close"
      left="10%"
      right="60%"
      bottom="3%"
    />
  )
}

CancelOrderButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default CancelOrderButton
