import BottomButton from './BottomButton'
import {MapState} from '../../../../ducks/map'
import React from 'react'
import PropTypes from 'prop-types'

const SearchRoutesButton = props => {
  return (
    <BottomButton
      visible={props.mapState === MapState.SEARCH_ROUTES}
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
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default SearchRoutesButton
