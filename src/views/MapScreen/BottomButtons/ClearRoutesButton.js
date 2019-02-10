import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const ClearRoutesButton = props => {
  return (
    <BottomButton
      iconLeft
      onPress={props.onPress}
      iconName={props.iconName ? props.iconName : 'arrow-back'}
    />
  )
}

ClearRoutesButton.propTypes = {
  iconName: PropTypes.string,
  onPress: PropTypes.func,
}

export default ClearRoutesButton
