import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const DestinationButton = props => {
  return (
    <BottomButton
      iconRight
      onPress={props.onPress}
      text="destination"
      iconName="arrow-forward"
      bottom="3%"
    />
  )
}

DestinationButton.propTypes = {
  onPress: PropTypes.func,
}

export default DestinationButton
