import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const CancelOrderButton = props => {
  return (
    <BottomButton
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
  onPress: PropTypes.func,
}

export default CancelOrderButton
