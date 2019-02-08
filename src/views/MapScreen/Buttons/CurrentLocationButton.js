import React from 'react'
import PropTypes from 'prop-types'
import {MapState} from '../../../ducks/map'
import CustomFabWithIcon from '../../../components/UI/CustomFabWithIcon'
import {View} from 'react-native'

const CurrentLocationButton = props => {
  if (![MapState.INIT, MapState.SEARCH_ROUTES].includes(props.mapState))
    return null
  return (
    <View>
      <CustomFabWithIcon
        icon="locate"
        onPress={props.onPress}
        position="topRight"
      />
    </View>
  )
}

CurrentLocationButton.propTypes = {
  mapState: PropTypes.string,
  onPress: PropTypes.func,
}

export default CurrentLocationButton
