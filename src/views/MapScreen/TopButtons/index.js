import React from 'react'
import {View, StyleSheet} from 'react-native'
import AccountButton from './AccountButton'
import CurrentLocationButton from './CurrentLocationButton'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {MapState} from '../../../ducks/map'
import CancelOrderButton from './CancelOrderButton'

const TopButtons = props => {
  let content = null
  if ([MapState.INIT, MapState.SEARCH_ROUTES].includes(props.mapState))
    content = (
      <>
        <AccountButton
          mapState={props.mapState}
          toAccountView={props.toAccountView}
        />

        <CurrentLocationButton
          mapState={props.mapState}
          onPress={props.onCurrentLocationButtonPress}
        />
      </>
    )

  if (props.mapState === MapState.ROUTE_ORDERED) {
    content = <CancelOrderButton onPress={() => alert('TODO')} />
  }

  return <View style={styles.wrapper}>{content}</View>
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
