import React from 'react'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import DefaultIconButton from '../../../../components/UI/DefaultIconButton'

const AccountButton = props => {
  return (
    <DefaultIconButton
      icon="md-person"
      onPress={props.toAccountView}
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

AccountButton.propTypes = {
  toAccountView: PropTypes.func.isRequired,
}

export default AccountButton
