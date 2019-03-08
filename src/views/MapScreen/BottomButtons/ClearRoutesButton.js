import React from 'react'
import PropTypes from 'prop-types'
import DefaultButton from '../../../components/UI/DefaultButton'

const ClearRoutesButton = props => {
  return <DefaultButton onPress={props.onPress} iconLeft="arrow-back" />
}

ClearRoutesButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export default ClearRoutesButton
