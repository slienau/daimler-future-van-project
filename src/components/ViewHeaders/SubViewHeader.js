import React from 'react'
import PropTypes from 'prop-types'
import CustomViewHeader from './CustomViewHeader'

const SubViewHeader = props => {
  return (
    <CustomViewHeader
      title={props.title}
      icon="arrow-back"
      onPress={props.onArrowBackPress}
    />
  )
}

SubViewHeader.propTypes = {
  onArrowBackPress: PropTypes.func,
  title: PropTypes.string,
}

export default SubViewHeader
