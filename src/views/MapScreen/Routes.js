import React from 'react'
import _ from 'lodash'
import MapEncodedPolyline from '../../components/MapEncodedPolyline'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Routes = props => {
  if (!props.route) return null
  const colors = ['red', 'green', 'blue']
  const segments = ['toStartRoute', 'vanRoute', 'toDestinationRoute']
  return (props.hideStart ? segments.slice(1) : segments)
    .map(r => _.get(props.route[r], 'routes.0.overview_polyline.points'))
    .map((p, i) => (
      <MapEncodedPolyline
        key={i}
        points={p}
        strokeWidth={3}
        strokeColor={colors[i]}
      />
    ))
}

Routes.propTypes = {
  hideStart: PropTypes.bool,
  route: PropTypes.object,
}

export default connect(state => ({
  route: _.get(state.map, 'routes.0'),
}))(Routes)
