import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const PlaceOrderButton = props => {
  return (
    <BottomButton
      iconRight
      onPress={props.onPress}
      text="Order"
      iconName="arrow-forward"
      left="65%"
      right="3%"
      bottom="15%"
    />
  )
}

PlaceOrderButton.propTypes = {
  onPress: PropTypes.func,
}

export default PlaceOrderButton
