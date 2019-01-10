import BottomButton from './BottomButton'
import {MapState} from '../../../../ducks/map'
import React from 'react'
import PropTypes from 'prop-types'

const CancelOrderButton = props => {
  return (
    <BottomButton
      visible={props.mapState === MapState.ROUTE_SEARCHED}
      iconLeft
      onPress={props.onPress}
      iconName="arrow-back"
      left="3%"
      right="85%"
      bottom="15%"
    />
  )
}

CancelOrderButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default CancelOrderButton
