import React from 'react'
import {View, StyleSheet} from 'react-native'
import AccountButton from './AccountButton'
import CurrentLocationButton from './CurrentLocationButton'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {OrderState} from '../../../../ducks/map'
import CancelOrderButton from './CancelOrderButton'

const TopButtons = props => {
  let content = null
  if ([OrderState.INIT, OrderState.SEARCH_ROUTES].includes(props.orderState))
    content = (
      <>
        <AccountButton toAccountView={props.toAccountView} />
        <CurrentLocationButton onPress={props.onCurrentLocationButtonPress} />
      </>
    )

  if (props.orderState === OrderState.ROUTE_ORDERED) {
    content = <CancelOrderButton />
  }

  return (
    <View
      style={[
        styles.wrapper,
        props.orderState === OrderState.SEARCH_ROUTES ||
        props.orderState === OrderState.ROUTE_SEARCHED
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
  onCurrentLocationButtonPress: PropTypes.func.isRequired,
  orderState: PropTypes.string.isRequired,
  toAccountView: PropTypes.func.isRequired,
}

export default connect(state => ({
  orderState: state.map.orderState,
}))(TopButtons)
