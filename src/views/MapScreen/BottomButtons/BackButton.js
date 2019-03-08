import React from 'react'
import PropTypes from 'prop-types'
import DefaultButton from '../../../components/UI/DefaultButton'

const BackButton = props => {
  return <DefaultButton onPress={props.onPress} iconLeft="arrow-back" />
}

BackButton.propTypes = {
  onPress: PropTypes.func,
}

export default BackButton
