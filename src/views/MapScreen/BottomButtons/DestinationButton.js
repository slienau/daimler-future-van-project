import React from 'react'
import PropTypes from 'prop-types'
import CustomButton from '../../../components/UI/CustomButton'

const DestinationButton = props => {
  return (
    <CustomButton
      onPress={() => props.toSearchView('DESTINATION')}
      text="Destination"
      iconRight="arrow-forward"
    />
  )
}

DestinationButton.propTypes = {
  toSearchView: PropTypes.func,
}

export default DestinationButton
