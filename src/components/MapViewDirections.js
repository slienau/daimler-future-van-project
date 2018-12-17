// https://raw.githubusercontent.com/bramus/react-native-maps-directions/master/src/MapViewDirections.js
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import MapView from 'react-native-maps'
import isEqual from 'lodash.isequal'

class MapViewDirections extends Component {
  constructor(props) {
    super(props)

    this.state = {
      coordinates: null,
      distance: null,
      duration: null,
    }
  }

  componentDidMount() {
    this._mounted = true
    this.fetchAndRenderRoute(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(nextProps.origin, this.props.origin) ||
      !isEqual(nextProps.destination, this.props.destination) ||
      !isEqual(nextProps.waypoints, this.props.waypoints) ||
      !isEqual(nextProps.mode, this.props.mode)
    ) {
      if (nextProps.resetOnChange === false) {
        this.fetchAndRenderRoute(nextProps)
      } else {
        this.resetState(() => {
          this.fetchAndRenderRoute(nextProps)
        })
      }
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  resetState = (cb = null) => {
    this._mounted &&
      this.setState(
        {
          coordinates: null,
          distance: null,
          duration: null,
        },
        cb
      )
  }
  decode(t, e) {
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
        c = Math.pow(10, e || 5);
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

    return d.map(tt => ({
      latitude: tt[0],
      longitude: tt[1],
    }))
  }

  fetchAndRenderRoute = async props => {
    let {origin, destination, waypoints} = props
    const {
      apikey,
      onStart,
      onReady,
      onError,
      mode = 'driving',
      language = 'en',
      directionsServiceBaseUrl = 'https://maps.googleapis.com/maps/api/directions/json',
    } = props

    if (!origin || !destination) {
      return
    }

    if (origin.latitude && origin.longitude) {
      origin = `${origin.latitude},${origin.longitude}`
    }

    if (destination.latitude && destination.longitude) {
      destination = `${destination.latitude},${destination.longitude}`
    }

    if (!waypoints || !waypoints.length) {
      waypoints = ''
    } else {
      waypoints = waypoints
        .map(waypoint =>
          waypoint.latitude && waypoint.longitude
            ? `${waypoint.latitude},${waypoint.longitude}`
            : waypoint
        )
        .join('|')
    }

    onStart &&
      onStart({
        origin,
        destination,
        waypoints: waypoints ? waypoints.split('|') : [],
      })

    try {
      var result = await this.fetchRoute(
        directionsServiceBaseUrl,
        origin,
        waypoints,
        destination,
        apikey,
        mode,
        language
      )
      if (!this._mounted) return
      this.setState(result)
      onReady && onReady(result)
    } catch (errorMessage) {
      this.resetState()
      console.warn(`MapViewDirections Error: ${errorMessage}`) // eslint-disable-line no-console
      onError && onError(errorMessage)
    }
  }

  async fetchRoute(
    directionsServiceBaseUrl,
    origin,
    waypoints,
    destination,
    apikey,
    mode,
    language
  ) {
    // Define the URL to call. Only add default parameters to the URL if it's a string.
    let url = directionsServiceBaseUrl
    if (typeof directionsServiceBaseUrl === 'string') {
      url += `?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode}&language=${language}`
    }

    const response = await fetch(url)
    const json = await response.json()
    if (json.status !== 'OK') {
      const errorMessage = json.error_message || 'Unknown error'
      throw new Error(errorMessage)
    }

    if (!json.routes.length) throw new Error('no routes found')
    const route = json.routes[0]
    return {
      distance:
        route.legs.reduce((carry, curr) => {
          return carry + curr.distance.value
        }, 0) / 1000,
      duration:
        route.legs.reduce((carry, curr) => {
          return carry + curr.duration.value
        }, 0) / 60,
      coordinates: this.decode(route.overview_polyline.points),
      fare: route.fare,
    }
  }

  render() {
    if (!this.state.coordinates) {
      return null
    }

    const {
      origin, // eslint-disable-line no-unused-vars
      waypoints, // eslint-disable-line no-unused-vars
      destination, // eslint-disable-line no-unused-vars
      apikey, // eslint-disable-line no-unused-vars
      onReady, // eslint-disable-line no-unused-vars
      onError, // eslint-disable-line no-unused-vars
      mode, // eslint-disable-line no-unused-vars
      language, // eslint-disable-line no-unused-vars
      ...props
    } = this.props

    return <MapView.Polyline coordinates={this.state.coordinates} {...props} />
  }
}

MapViewDirections.propTypes = {
  apikey: PropTypes.string.isRequired,
  destination: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ]),
  directionsServiceBaseUrl: PropTypes.string,
  language: PropTypes.string,
  mode: PropTypes.oneOf(['driving', 'bicycling', 'transit', 'walking']),
  onError: PropTypes.func,
  onReady: PropTypes.func,
  onStart: PropTypes.func,
  origin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ]),
  resetOnChange: PropTypes.bool,
  waypoints: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
    ])
  ),
}

export default MapViewDirections
