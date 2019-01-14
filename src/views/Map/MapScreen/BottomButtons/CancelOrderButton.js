import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const CancelOrderButton = props => {
  return (
    <BottomButton
      iconLeft
      onPress={props.onPress}
      iconName={props.iconName ? props.iconName : 'arrow-back'}
      left="3%"
      right="85%"
      bottom={props.bottom ? props.bottom : '15%'}
    />
  )
}

CancelOrderButton.propTypes = {
  bottom: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
}

export default CancelOrderButton
