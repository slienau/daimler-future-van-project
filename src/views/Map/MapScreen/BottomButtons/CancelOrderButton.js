import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const CancelOrderButton = props => {
  return (
    <BottomButton
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
  onPress: PropTypes.func,
}

export default CancelOrderButton
