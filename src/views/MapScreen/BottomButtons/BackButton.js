import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const BackButton = props => {
  return <BottomButton onPress={props.onPress} iconName="arrow-back" />
}

BackButton.propTypes = {
  onPress: PropTypes.func,
}

export default BackButton
