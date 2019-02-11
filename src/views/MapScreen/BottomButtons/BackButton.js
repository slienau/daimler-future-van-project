import React from 'react'
import PropTypes from 'prop-types'
import CustomButton from '../../../components/UI/CustomButton'

const BackButton = props => {
  return <CustomButton onPress={props.onPress} iconLeft="arrow-back" />
}

BackButton.propTypes = {
  onPress: PropTypes.func,
}

export default BackButton
