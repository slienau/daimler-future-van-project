import React from 'react'
import PropTypes from 'prop-types'
import CustomButton from '../../../components/UI/CustomButton'

const BottomButton = props => {
  return (
    <CustomButton
      onPress={props.onPress}
      text={props.text}
      iconRight={props.iconName}
    />
  )
}

BottomButton.propTypes = {
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  text: PropTypes.string,
}

export default BottomButton
