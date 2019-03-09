import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {cancelActiveOrder} from '../../../../ducks/orders'
import {Alert, StyleSheet} from 'react-native'
// import PushNotification from 'react-native-push-notification'
import {Toast} from 'native-base'
import {defaultDangerToast, defaultSuccessToast} from '../../../../lib/toasts'
import DefaultIconButton from '../../../../components/UI/DefaultIconButton'

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
              // PushNotification.cancelAllLocalNotifications()
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
    <DefaultIconButton
      icon="md-close"
      onPress={() => cancelActiveOrder()}
      style={styles.button}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 0,
  },
})

CancelOrderButton.propTypes = {
  cancelActiveOrder: PropTypes.func.isRequired,
}

export default connect(
  null,
  dispatch => ({
    cancelActiveOrder: () => dispatch(cancelActiveOrder()),
  })
)(CancelOrderButton)
