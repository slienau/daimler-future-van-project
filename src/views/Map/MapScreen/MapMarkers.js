import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import MapMarker from '../../../components/MapMarker'
import {connect} from 'react-redux'

const MapMarkers = props => {
  if (!props.routes || !props.routes.length) return null
  return (
    <>
      <MapMarker
        location={_.get(props.routes[0], 'startStation.location')}
        title={'Start station'}
        image="vbs"
      />
      <MapMarker
        location={_.get(props.routes[0], 'endStation.location')}
        title={'End station'}
        image="vbs"
      />
      {props.journeyStart && (
        <MapMarker
          location={props.journeyStart.location}
          title={'My Current Location'}
          image="person"
        />
      )}
      {props.journeyDestination && (
        <MapMarker image="destination" {...props.journeyDestination} />
      )}
    </>
  )
}

MapMarkers.propTypes = {
  routes: PropTypes.array,
}

const mapStateToProps = state => {
  return {
    routes: state.map.routes,
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
  }
}

export default connect(mapStateToProps)(MapMarkers)
