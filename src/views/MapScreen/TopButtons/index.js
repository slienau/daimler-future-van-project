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
    content = <CancelOrderButton />
  }

  return (
    <View
      style={[
        styles.wrapper,
        props.mapState === MapState.SEARCH_ROUTES ||
        props.mapState === MapState.ROUTE_SEARCHED
          ? styles.noTopMargin
          : null,
      ]}>
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
  },
  noTopMargin: {
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
