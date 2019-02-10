import React from 'react'
import PropTypes from 'prop-types'
import CustomFabWithIcon from '../../../components/UI/CustomFabWithIcon'

const AccountButton = props => {
  return (
    <CustomFabWithIcon
      icon="md-person"
      position="topLeft"
      onPress={props.toAccountView}
    />
  )
}

AccountButton.propTypes = {
  toAccountView: PropTypes.func.isRequired,
}

export default AccountButton
