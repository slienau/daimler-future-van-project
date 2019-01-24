import React from 'react'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import config from '../../../lib/config'
import {connect} from 'react-redux'
import {
  addSearchResultAction,
  changeMapState,
  MapState,
  setJourneyDestination,
  setJourneyStart,
  setVisibleCoordinates,
} from '../../../ducks/map'
import _ from 'lodash'
import PropTypes from 'prop-types'

const SearchScreen = props => {
  const predefinedPlaces = _.uniqBy(props.searchResults, 'id')

  const handleSearchResult = (data, details) => {
    if (!details) return

    // extract needed data from the search result and distinguish between current location or not
    // if current location, we dont want to add it to the list of last searches
    if (details.description === 'Current location') {
      // name field is not set for current location, so set it
      details.name = details.description
    } else {
      details.description = details.name
      props.addSearchResult(details)
    }
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    const type = ['start', 'destination'].indexOf(
      _.lowerCase(props.navigation.getParam('type'))
    )
    props.setJourney(type === 0, {
      location: location,
      title: details.name,
      description: details.vicinity,
    })
    props.changeMapState(MapState.SEARCH_ROUTES)
    props.setVisibleCoordinates(
      _.compact([location, _.get(_.nth(props.journey, type - 1), 'location')])
    )
  }

  return (
    <GooglePlacesAutocomplete
      placeholder={'Search'}
      minLength={2} // minimum length of text to search
      autoFocus
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed="true" // true/false/undefined
      fetchDetails
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => {
        handleSearchResult(data, details)
        props.navigation.goBack()
      }}
      getDefaultValue={() => ''}
      query={{
        key: config.googleApiKey,
        language: 'en',
      }}
      styles={{
        textInputContainer: {
          backgroundColor: 'rgb(255,255,255)',
          borderBottomWidth: 2,
        },
        description: {
          // fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#000000',
        },
      }}
      currentLocation // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI={'None'} // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={
        {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }
      }
      GooglePlacesSearchQuery={
        {
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          // rankby: 'distance'
        }
      }
      // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={predefinedPlaces}
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />
  )
}

SearchScreen.propTypes = {
  addSearchResult: PropTypes.func,
  changeMapState: PropTypes.func,
  journey: PropTypes.array,
  searchResults: PropTypes.array,
  setJourney: PropTypes.func,
  setVisibleCoordinates: PropTypes.func,
}

export default connect(
  state => ({
    searchResults: state.map.searchResults,
    journey: [state.map.journeyStart, state.map.journeyDestination],
  }),
  dispatch => ({
    addSearchResult: result => dispatch(addSearchResultAction(result)),
    changeMapState: payload => dispatch(changeMapState(payload)),
    setJourney: (isStart, payload) =>
      dispatch(
        isStart ? setJourneyStart(payload) : setJourneyDestination(payload)
      ),
    setVisibleCoordinates: (coords, edgePadding) =>
      dispatch(setVisibleCoordinates(coords, edgePadding)),
  })
)(SearchScreen)
