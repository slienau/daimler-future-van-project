import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const PlaceOrderButton = props => {
  return (
    <BottomButton
      iconRight
      onPress={props.onPress}
      text="Place Order"
      iconName="arrow-forward"
      left="42%"
      right="10%"
      bottom="3%"
    />
  )
}

PlaceOrderButton.propTypes = {
  onPress: PropTypes.func,
}

export default PlaceOrderButton
