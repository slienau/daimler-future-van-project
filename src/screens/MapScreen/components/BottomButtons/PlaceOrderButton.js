import React from 'react'
import PropTypes from 'prop-types'
import {ProgressButton} from 'react-native-progress-button'
import {DARK_COLOR} from '../../../../components/UI/colors'

const PlaceOrderButton = props => {
  const isRefresh = props.routeExpireProgress === 0
  return (
    <ProgressButton
      buttonState="progress"
      smoothly
      progress={props.routeExpireProgress}
      progressColor={DARK_COLOR}
      onPress={props.onPress}
      text={isRefresh ? 'Refresh Route' : 'Place Order'}
    />
  )
}

PlaceOrderButton.propTypes = {
  onPress: PropTypes.func,
  routeExpireProgress: PropTypes.number,
}

export default PlaceOrderButton
