import React from 'react'
import PropTypes from 'prop-types'
import CustomViewHeader from './CustomViewHeader'

const MainViewHeader = props => {
  return (
    <CustomViewHeader
      title={props.title}
      icon="menu"
      onPress={props.onMenuPress}
    />
  )
}

MainViewHeader.propTypes = {
  onMenuPress: PropTypes.func,
  title: PropTypes.string,
}

export default MainViewHeader
