import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const SearchRoutesButton = props => {
  return (
    <BottomButton
      onPress={props.onPress}
      text="Search Route"
      iconName="arrow-forward"
    />
  )
}

SearchRoutesButton.propTypes = {
  onPress: PropTypes.func,
}

export default SearchRoutesButton
