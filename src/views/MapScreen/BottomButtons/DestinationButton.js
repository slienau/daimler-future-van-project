import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const DestinationButton = props => {
  return (
    <BottomButton
      onPress={props.onPress}
      text="destination"
      iconName="arrow-forward"
    />
  )
}

DestinationButton.propTypes = {
  onPress: PropTypes.func,
}

export default DestinationButton
