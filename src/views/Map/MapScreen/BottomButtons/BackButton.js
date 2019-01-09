import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const BackButton = props => {
  return (
    <BottomButton
      iconLeft
      onPress={props.onPress}
      text=""
      iconName="arrow-back"
      left="10%"
      right="70%"
      bottom="3%"
    />
  )
}

BackButton.propTypes = {
  onPress: PropTypes.func,
}

export default BackButton
