import React from 'react'
import PropTypes from 'prop-types'
import CustomFabWithIcon from '../../../components/UI/CustomFabWithIcon'

const CurrentLocationButton = props => {
  return (
    <CustomFabWithIcon
      icon="locate"
      onPress={props.onPress}
      position="topRight"
    />
  )
}

CurrentLocationButton.propTypes = {
  onPress: PropTypes.func,
}

export default CurrentLocationButton
