import React from 'react'
import PropTypes from 'prop-types'
import DefaultButton from '../../../../components/UI/DefaultButton'

const DestinationButton = props => {
  return (
    <DefaultButton
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
