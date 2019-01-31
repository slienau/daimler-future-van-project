import React from 'react'
import PropTypes from 'prop-types'
import {ProgressButton} from 'react-native-progress-button'

const PlaceOrderButton = props => {
  return (
    <ProgressButton
      buttonState="progress"
      smoothly
      progress={props.routeExipreProgress.toFixed(0)}
      progressColor="green"
      onPress={props.onPress}
      text="Place Order"
    />
  )
}

PlaceOrderButton.propTypes = {
  onPress: PropTypes.func,
  routeExipreProgress: PropTypes.number,
}

export default PlaceOrderButton
