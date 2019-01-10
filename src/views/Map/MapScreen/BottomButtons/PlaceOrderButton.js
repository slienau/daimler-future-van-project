import BottomButton from './BottomButton'
import {MapState} from '../../../../ducks/map'
import React from 'react'
import PropTypes from 'prop-types'

const PlaceOrderButton = props => {
  return (
    <BottomButton
      visible={props.mapState === MapState.ROUTE_SEARCHED}
      iconRight
      onPress={props.onPress}
      text="Order"
      iconName="arrow-forward"
      left="65%"
      right="3%"
      bottom="15%"
    />
  )
}

PlaceOrderButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default PlaceOrderButton
