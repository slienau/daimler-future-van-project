import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CustomFabWithIcon from '../../../components/UI/CustomFabWithIcon'
import {cancelActiveOrder} from '../../../ducks/orders'
import {Alert} from 'react-native'
import PushNotification from 'react-native-push-notification'
import {Toast} from 'native-base'
import {defaultDangerToast, defaultSuccessToast} from '../../../lib/toasts'

const CancelOrderButton = props => {
  const cancelActiveOrder = async () => {
    Alert.alert(
      'Cancel your order',
      'Do you want to cancel your current order?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              PushNotification.cancelAllLocalNotifications()
              await props.cancelActiveOrder()
              Toast.show(defaultSuccessToast('Your order has been canceled!'))
            } catch (error) {
              Toast.show(
                defaultDangerToast(
                  "Your order couldn't be canceled! " + error.message
                )
              )
            }
          },
        },
        {text: 'No'},
      ],
      {cancelable: true}
    )
  }

  return (
    <CustomFabWithIcon
      icon="md-close"
      onPress={() => cancelActiveOrder()}
      position="topLeft"
    />
  )
}

CancelOrderButton.propTypes = {
  cancelActiveOrder: PropTypes.func.isRequired,
}

export default connect(
  null,
  dispatch => ({
    cancelActiveOrder: () => dispatch(cancelActiveOrder()),
  })
)(CancelOrderButton)
