import React from 'react'
import PropTypes from 'prop-types'
import CustomButton from '../../../components/UI/CustomButton'

const SearchRoutesButton = props => {
  return (
    <CustomButton
      onPress={props.onPress}
      text="Search Route"
      iconRight="arrow-forward"
    />
  )
}

SearchRoutesButton.propTypes = {
  onPress: PropTypes.func,
}

export default SearchRoutesButton
