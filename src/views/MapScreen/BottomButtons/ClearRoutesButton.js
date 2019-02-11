import React from 'react'
import PropTypes from 'prop-types'
import CustomButton from '../../../components/UI/CustomButton'

const ClearRoutesButton = props => {
  return <CustomButton onPress={props.onPress} iconLeft="arrow-back" />
}

ClearRoutesButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export default ClearRoutesButton
