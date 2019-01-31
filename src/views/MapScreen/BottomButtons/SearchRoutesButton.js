import BottomButton from './BottomButton'
import React from 'react'
import PropTypes from 'prop-types'

const SearchRoutesButton = props => {
  return (
    <BottomButton
      iconRight
      onPress={props.onPress}
      text="Search Route"
      iconName="arrow-forward"
      left="45%"
      right="10%"
      bottom="3%"
    />
  )
}

SearchRoutesButton.propTypes = {
  onPress: PropTypes.func,
}

export default SearchRoutesButton
