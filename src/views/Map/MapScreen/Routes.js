import React from 'react'
import _ from 'lodash'
import MapEncodedPolyline from '../../../components/MapEncodedPolyline'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Routes = props => {
  if (!props.routes || !props.routes.length) return null
  const colors = ['red', 'green', 'blue']
  return ['toStartRoute', 'vanRoute', 'toDestinationRoute']
    .map(r => _.get(props.routes[0][r], 'routes.0.overview_polyline.points'))
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
  routes: PropTypes.array,
}

const mapStateToProps = state => {
  return {routes: state.map.routes}
}

export default connect(mapStateToProps)(Routes)
