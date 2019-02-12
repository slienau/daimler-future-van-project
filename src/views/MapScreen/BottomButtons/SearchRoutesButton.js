import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CustomButton from '../../../components/UI/CustomButton'
import {fetchRoutes} from '../../../ducks/map'
import {Toast} from 'native-base'
import {defaultDangerToast} from '../../../lib/toasts'

const SearchRoutesButton = props => {
  const fetchRoutes = async () => {
    try {
      await props.fetchRoutes()
    } catch (error) {
      if (error.code === 404)
        Toast.show(defaultDangerToast('No routes found. ' + error.message, 0))
      else
        Toast.show(defaultDangerToast('Error getting routes. ' + error.message))
    }
  }

  return (
    <CustomButton
      onPress={() => fetchRoutes()}
      disabled={!props.userDestinationLocation || !props.userStartLocation}
      text="Search Route"
      iconRight="arrow-forward"
    />
  )
}

SearchRoutesButton.propTypes = {
  fetchRoutes: PropTypes.func,
  userDestinationLocation: PropTypes.object,
  userStartLocation: PropTypes.object,
}

export default connect(
  state => ({
    userStartLocation: state.map.userStartLocation,
    userDestinationLocation: state.map.userDestinationLocation,
  }),
  dispatch => ({
    fetchRoutes: () => dispatch(fetchRoutes()),
  })
)(SearchRoutesButton)
