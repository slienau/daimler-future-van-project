import BottomButton from './BottomButton'
import {MapState} from '../../../ducks/map'
import React from 'react'
import PropTypes from 'prop-types'

const BackButton = props => {
  return (
    <BottomButton
      visible={props.mapState === MapState.SEARCH_ROUTES}
      iconLeft
      onPress={props.onPress}
      text=""
      iconName="arrow-back"
      left="10%"
      right="70%"
      bottom="3%"
    />
  )
}

BackButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default BackButton
