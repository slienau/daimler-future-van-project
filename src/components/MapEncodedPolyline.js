import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Polyline} from 'react-native-maps'
import _ from 'lodash'

export default class MapEncodedPolyline extends Component {
  static propTypes = {
    points: PropTypes.string.isRequired,
    resetOnChange: PropTypes.bool,
  }

  state = {
    coordinates: null,
  }

  componentDidMount() {
    this.decode()
  }
  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps.points, this.props.points)) return
    if (nextProps.resetOnChange === false) {
      this.decode()
    } else {
      this.resetState(() => {
        this.decode()
      })
    }
  }

  decode() {
    const t = this.props.points
    const d = []
    for (
      let n,
        o,
        u = 0,
        l = 0,
        r = 0,
        h = 0,
        i = 0,
        a = null,
        c = Math.pow(10, 5);
      u < t.length;

    ) {
      a = null
      h = 0
      i = 0
      do {
        a = t.charCodeAt(u++) - 63
        i |= (31 & a) << h
        h += 5
      } while (a >= 32)
      n = 1 & i ? ~(i >> 1) : i >> 1
      h = i = 0
      do {
        a = t.charCodeAt(u++) - 63
        i |= (31 & a) << h
        h += 5
      } while (a >= 32)
      o = 1 & i ? ~(i >> 1) : i >> 1
      l += n
      r += o
      d.push([l / c, r / c])
    }

    const coordinates = d.map(tt => ({
      latitude: tt[0],
      longitude: tt[1],
    }))
    this.setState({coordinates})
  }

  render() {
    return (
      this.state.coordinates && (
        <Polyline coordinates={this.state.coordinates} {...this.props} />
      )
    )
  }
}
