import React from 'react'
import {View, StyleSheet} from 'react-native'
import AccountButton from './AccountButton'
import CurrentLocationButton from './CurrentLocationButton'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {MapState} from '../../../ducks/map'

const TopButtons = props => {
  if (![MapState.INIT, MapState.SEARCH_ROUTES].includes(props.mapState))
    return null
  return (
    <View style={styles.wrapper}>
      <AccountButton
        mapState={props.mapState}
        toAccountView={props.toAccountView}
      />

      <CurrentLocationButton
        mapState={props.mapState}
        onPress={props.onCurrentLocationButtonPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 0,
  },
})

TopButtons.propTypes = {
  mapState: PropTypes.string.isRequired,
  onCurrentLocationButtonPress: PropTypes.func.isRequired,
  toAccountView: PropTypes.func.isRequired,
}

export default connect(state => ({
  mapState: state.map.mapState,
}))(TopButtons)
